// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createDashboard } from './webview/dashboard';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
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

export function deactivate() {}
