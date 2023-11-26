import * as vscode from 'vscode';
import { PythonCodeLensProvider } from './PythonCodeLensProvider';
import { JavaCodeLensProvider } from './JavaCodeLensProvider';
import { Workflow, getAPIClass } from '../prompting/workflow';

export function createCodeLensMain(context: vscode.ExtensionContext) {

    createLanguageContexts(context);
    codelensRun(context);
    codelensRephrease(context);
}


function createLanguageContexts(context: vscode.ExtensionContext){
  context.subscriptions.push(vscode.languages.registerCodeLensProvider({ language: 'python' }, new PythonCodeLensProvider()));
  context.subscriptions.push(vscode.languages.registerCodeLensProvider({ language: 'java' }, new JavaCodeLensProvider()));
}


function codelensRun(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('multi-agent-llm.runCommentCode', async (document, position) => {
    
    // Await the rephrased text outside the edit callback
    const currentText = document.getText(position);
    const workfow = new Workflow(context, currentText);
    const resultText = await workfow.run(); // Await the promise here

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // Perform the edit synchronously within the edit callback
        editor.edit(editBuilder => {
            editBuilder.replace(position, resultText.toString());
        });
    }
  }));
}

function codelensRephrease(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('multi-agent-llm.runRephrase', async (document: vscode.TextDocument, position: vscode.Range) => {

    const currentText = document.getText(position);
    const workflow = new Workflow(context, currentText);
    const resultText = await workflow.getCurrentRephraseModelResult(); // Await the promise here

    const editor = vscode.window.activeTextEditor;
    if (editor && resultText) { // Check if resultText is defined
      // Perform the edit synchronously within the edit callback
      editor.edit(editBuilder => {
        editBuilder.replace(position, resultText.toString());
      });
    }
  	}));
}