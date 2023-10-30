import * as vscode from 'vscode';
import { PythonCodeLensProvider } from './PythonCodeLensProvider';
import { chat } from '../apis/openaiClient';
import { gpt4 } from '../apis/gpt';

export function createCodeLensMain(context: vscode.ExtensionContext) {

    createPython(context);
}


function createPython(context: vscode.ExtensionContext){
    context.subscriptions.push(vscode.languages.registerCodeLensProvider({ language: 'python' }, new PythonCodeLensProvider()));
  
	context.subscriptions.push(vscode.commands.registerCommand('multi-agent-llm.runCommentCode', async (document: vscode.TextDocument, position: vscode.Range) => {
      const message = await chat(document.getText(position), gpt4);
      vscode.window.showInformationMessage(message);
	}));
}