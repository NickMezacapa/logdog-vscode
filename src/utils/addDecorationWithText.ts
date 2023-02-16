import * as vscode from "vscode";

/**
 * 
 * @name addDecorationWithText
 * @description addDecorationWithText adds a decoration to the document
 * 
 * This function is called every time the user saves the document.
 * It adds a decoration to the document, the decoration will represent the value of the log expression.
 * By design, the decorations will only stay active for 6 seconds, then disappear. The user can customize this time interval.
 * The user can save document to display decorations again.
 * 
 * @param contentText - the text to be added to the decoration
 * @param variable - the variable that was evaluated, to be used as hover message
 * @param line - the line number of the variable within the document to add decoration to
 * @param column - the column number of the variable within the document to add decoration to
 * @param activeEditor - the active text editor
 * @param textColor - the color of the text in the decoration, customizable by user
 * 
 */

export default function addDecorationWithText(contentText: string, variable: string, line: number, column: number, activeEditor: vscode.TextEditor, textColor: string | vscode.ThemeColor ): void {
    const decorationType = vscode.window.createTextEditorDecorationType({
        after: {
            contentText,
            // passing in textColor parameter so we can call with different colors, user can have messages displayed in mult. colors
            color: textColor,
            margin: "0 0 0 1em",
        },
        isWholeLine: true,
    });
    const decoRange = new vscode.Range(line, column, line, column);
    const decoration = {
        range: decoRange,
        hoverMessage: `${variable}: ${contentText}`,
    };

    activeEditor.setDecorations(decorationType, []);
    activeEditor.setDecorations(decorationType, [decoration]);

    // I don't know why, but every time I save the document, a new decoration is added, causing the decorations to stack on top of each other
    // I only want one decoration per variable, regardless of how many times the user saves the document
    // I tried to use decorationType.dispose() to remove the decoration, but it didn't work
    // I tried to use activeEditor.setDecorations(decorationType, []) to remove the decoration, but it didn't work
    // I tried to use activeEditor.setDecorations(decorationType, [decoration]) to remove the decoration, but it didn't work
    // one way to fix this without using timeout is to use a global variable to store the decorationType and remove it before adding a new one
    // I can create the global variable in this function, but I don't know how to access it in the other functions
    // one way to access the global variable is to use the globalStoragePath, but I don't know how to use it
    // I can use the globalStoragePath by creating a new file in the src folder,
    // then importing the file in this function and the other functions that need to access the global variable
    // 

    // remove the decoration after a set amount of time
    // the interval is 6 seconds by default, but is customizable in package.json contributes config
    const userMessageVisibilityInterval: number = vscode.workspace.getConfiguration('logdog').get('messageVisibilityInterval')!;
    setTimeout(() => {
        decorationType.dispose();
        activeEditor.setDecorations(decorationType, []);
    }, userMessageVisibilityInterval);
}
