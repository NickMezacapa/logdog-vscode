import * as vscode from 'vscode';
import addDecorationWithText from './addDecorationWithText';
import { cacheLogger, LogResult } from './cacheLogger';

/**
 * 
 * @function initLogger
 * @description initLogger reads document text from editor and evaluates console.log expressions
 * 
 * This function is called every time the user saves the document.
 * It evaluates console.log expressions in the context of the running program and caches the results.
 * 
 * @param post - a function that takes a method and params and returns a promise
 * @returns a promise that resolves to an array of log results
 * 
 */

export default async function initLogger(post: (method: string, params?: any) => Promise<any>): Promise<void> {
    // get the active text editor, if it does not exist, return
    // access to the active text editor will allow us to access the document text
    const activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return;
    }

    const document: vscode.TextDocument = activeEditor.document;
    const fileName: string = document.uri.fsPath;
    const regex: RegExp = /console\.log\((.*)\)/g; // regex to match console.log expressions
    const text: string = document.getText(); 
    let match; // store for regex matches

    // compile the document script, then run
    const { scriptId } = await post("Runtime.compileScript", { 
        expression: text,
        sourceURL: fileName,
        persistScript: true,
    });
    await post("Runtime.runScript", { scriptId }); 

    // declare array to store variable names from the text document
    const data: { names: string[] } = await post("Runtime.globalLexicalScopeNames", { executionContextId: 1 });

    // loop through the text document and find all instances of "console.log"
    while ((match = regex.exec(text))) {
        // if we find a match, we want to save the line number and column number of the match within the document,
        // as well as the variable name that is being logged
        // the line and column numbers will be used to add decorations to the document 
        const line: number = document.positionAt(match.index).line; 
        const column: number = document.positionAt(match.index).character; 
        const code: string = match[0];
        let variable: string = match[1];

        const logResult: { result: { value: string } } = await post("Runtime.evaluate", {
            expression: `JSON.stringify(${variable})`,
            contextId: 1,
        });
        const value: string = logResult.result.value;

        // cache the variable and evaluated expression
        const evaluatedPair: LogResult = { variable: value }; // current variable being evaluated
        const updatedCache: LogResult = cacheLogger(evaluatedPair); // cacheLogger will add/update/neither the evaluatedPair depending on its current value and return the new cache

        // get the log message text color from package.json contributes config
        // the user can have a different color for log messages and function evals
        const userCustomLogColor: string | vscode.ThemeColor = vscode.workspace.getConfiguration('logdog').get('logMessageColor')!;

        // if any decorations exist, remove them
        activeEditor.setDecorations(vscode.window.createTextEditorDecorationType({}), []);

        // add decoration for each key if log messages are enabled
        if (vscode.workspace.getConfiguration("logdog").get("showLogExpressions") === true) {
            for (const key in updatedCache) {
                if (updatedCache[key] !== undefined) {
                    addDecorationWithText(` -> ${updatedCache[key]}`, key, line, column, activeEditor, userCustomLogColor);
                }
            }
        }
    }
    
    // search the document for function calls,
    // evaluate each function call with the given paramaters and add a decoration with the returned value from the cache
    const functionRegex: RegExp = /(\w+)\((.*)\)/g;
    while ((match = functionRegex.exec(text))) {
        const line: number = document.positionAt(match.index).line;
        const column: number = document.positionAt(match.index).character;
        const code: string = match[0];
        const functionName: string = match[1];
        const params: string = match[2];

        const functionResult: { result: { value: string } } = await post("Runtime.evaluate", {
            expression: `JSON.stringify(${functionName}(${params}))`,
            contextId: 1,
        });
        const value: string = functionResult.result.value;

        // add the function and returned value to the cache
        const evaluatedPair: LogResult = { [functionName]: value };
        const updatedCache: LogResult = cacheLogger(evaluatedPair);

        // get the function evaluation text color from package.json contributes config
        const userCustomFunctionColor: string | vscode.ThemeColor = vscode.workspace.getConfiguration('logdog').get('functionEvaluationColor')!;

        // add decoration for each key if function evaluations are enabled
        if (vscode.workspace.getConfiguration("logdog").get("showFunctionEvaluations") === true) {
            for (const key in updatedCache) {
                if (updatedCache[key] !== undefined) {
                    addDecorationWithText(` => ${updatedCache[key]}`, key, line, column, activeEditor, userCustomFunctionColor);
                }
            }
        }
    }
}
