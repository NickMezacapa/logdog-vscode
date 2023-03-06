import * as vscode from 'vscode';
import initLogger from './utils/initLogger';

const inspector = require('node:inspector');
const util = require('util');

/**
 * @function activate
 * @description This method is called when the extension is activated.
 * 
 * Extension.ts provides the implementation for the activation command.
 * Per package.json manifest the extension is activated when the editor finishes startup.
 * The activate function contains all the logic for the logger.
 * Each time the user saves their current document, the activated extension will call the initLogger function.
 * 
 * @param {vscode.ExtensionContext} context
 * @returns {void} Promise<void>
 */

export async function activate(context: vscode.ExtensionContext): Promise<void>{
    const session = new inspector.Session();
    session.connect();

    // enable the debugger
    // debugger is used to evaluate expressions in the context of the running program
    const post: (method: string, params?: any) => Promise<any> = util.promisify(session.post).bind(session); // binds the debugger to the current node inspector session
    await post("Debugger.enable");
    await post("Runtime.enable");

    // every time the user saves the document, run the logger and display the results
    vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument): Promise<void> => {
        // if auto saving is disabled in the editer, await initLogger
        if (vscode.workspace.getConfiguration("files").get("autoSave") === "off" && 
            vscode.workspace.getConfiguration("logdog").get("enableExtension") === true) {
            await initLogger(post);
        }
    });

    // register a command so that when the user enters a keybinding, the initLogger function is ran
    // the purpose of declaring this command is for users that have autoSave enabled in their editor
    const activateLogger = vscode.commands.registerTextEditorCommand('extension.activateLogger', async () => {
        // the document should save when user enters keybinding
        // initLogger should only be called after the document has been saved
        await vscode.commands.executeCommand('workbench.action.files.save');
    });

    context.subscriptions.push(activateLogger);
}

