import * as vscode from 'vscode';
import { PythonCodeLensProvider } from './PythonCodeLensProvider';
import { chat as gptChat } from '../apis/openaiClient';
import { chat as makersuitChat } from '../apis/makersuitClient';

export function createCodeLensMain(context: vscode.ExtensionContext) {

    createPython(context);
}


function createPython(context: vscode.ExtensionContext){
  context.subscriptions.push(vscode.languages.registerCodeLensProvider({ language: 'python' }, new PythonCodeLensProvider()));
  
	context.subscriptions.push(vscode.commands.registerCommand('multi-agent-llm.runCommentCode', async (document: vscode.TextDocument, position: vscode.Range) => {
    //   const messageGPT = await gptChat(document.getText(position), gpt4);
    console.log(document.getText(position));
    const messageBard = await makersuitChat(document.getText(position));
    //   console.log(messageGPT);
    console.log(messageBard);

	}));
}