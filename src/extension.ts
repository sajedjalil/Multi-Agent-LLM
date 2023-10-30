// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createDashboard } from './webview/dashboard';
import { createCodeLensMain } from './codelens/CodeLensMain';

// let myStatusBarItem: vscode.StatusBarItem;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	activateDashboard(context);
	activateCodeLens(context);
	// activateMenuItem(context);
}


export function activateCodeLens(context: vscode.ExtensionContext) {
	createCodeLensMain(context);
}

function activateDashboard(context: vscode.ExtensionContext){
	console.log("Activated Multi-Agent LLM.");
	// Check if it's the first run
	context.globalState.update('isFirstRun', true);
	const isFirstRun = context.globalState.get('isFirstRun', true);

	if (isFirstRun) {
	  // Show the dashboard webview automatically
	  createDashboard(context);
	  // Update the global state to indicate that the dashboard has been shown
	  context.globalState.update('isFirstRun', false);
	}
  
	// Command registration for opening the dashboard
	const disposable = vscode.commands.registerCommand('multi-agent-llm.openDashboard', () => {
	  createDashboard(context);
	});
  
	context.subscriptions.push(disposable);
}

// function activateMenuItem({subscriptions}: vscode.ExtensionContext){
// 	// register a command that is invoked when the status bar
// 	// item is selected
// 	const myCommandId = 'sample.showSelectionCount';
// 	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
// 		const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
// 		vscode.window.showInformationMessage(`Yeah, ${n} line(s) selected... Keep going!`);
// 	}));

// 	// create a new status bar item that we can now manage
// 	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
// 	myStatusBarItem.command = myCommandId;
// 	subscriptions.push(myStatusBarItem);

// 	// register some listener that make sure the status bar 
// 	// item always up-to-date
// 	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
// 	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

// 	// update status bar item once at start
// 	updateStatusBarItem();
// }

// function updateStatusBarItem(): void {
// 	const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
// 	if (n > 0) {
// 		myStatusBarItem.text = `$(megaphone) ${n} line(s) selected`;
// 		myStatusBarItem.show();
// 	} else {
// 		myStatusBarItem.hide();
// 	}
// }

// function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
// 	let lines = 0;
// 	if (editor) {
// 		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
// 	}
// 	return lines;
// }



export function deactivate() {}
