import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { apiMappings } from '../apis/apiNameMappings';
import { getNonce, removeDroppedItem, saveDroppedItem } from './common/helper';

// Import the interface


export function createDashboard(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'dashboard', 'Dashboard',
    vscode.ViewColumn.One,{ enableScripts: true }
  );

  // context.globalState.update('droppedItems', undefined);
  console.log(context.globalState.get('droppedItems', []));
  

  panel.webview.html = getWebviewContent(context);

  panel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'saveDroppedItem':
          saveDroppedItem(context, message.data);
          return;
        case 'removeDroppedItem':
          removeDroppedItem(context, message.data);
          return;
      }
    },
    undefined,
    context.subscriptions
  );
}


function getWebviewContent(context: vscode.ExtensionContext): string{

  const htmlFilePath = path.join(context.extensionPath, 'src', 'webview', 'index.html');
  const styleFilePath = path.join(context.extensionPath, 'src', 'webview', 'styles', 'style.css');
  const scriptFilePath = path.join(context.extensionPath, 'src', 'webview', 'scripts', 'main.js');
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  const styleContent = fs.readFileSync(styleFilePath, 'utf8');
  const scriptContent = fs.readFileSync(scriptFilePath, 'utf8');
  const nonce = getNonce();

  // Now create dropdown options using the apiMappings
  const dropdownOptions = Object.entries(apiMappings).map(([key, value]) => `<option value="${value}">${key}</option>`).join('');

  // Replace placeholders in the HTML content
  htmlContent = htmlContent.replace('/* style-placeholder */', styleContent);
  // htmlContent = htmlContent.replace('// script-placeholder', scriptContent);
  // Find and replace the placeholder in your HTML with the created dropdown options
  htmlContent = htmlContent.replace(/<select>(.*?)<\/select>/gs, `<select>$1${dropdownOptions}</select>`);
  htmlContent = htmlContent.replace(/\${nonce}/g, nonce);

  const droppedItems = context.globalState.get('droppedItems', []);
  // Prepare the script to restore the dropped items
  const restoreScript = `
  // Assuming droppedItems is already declared in main.js
  droppedItems.splice(0, droppedItems.length, ...${JSON.stringify(droppedItems)});
  restoreDroppedItems(droppedItems);
  `;

  console.log(restoreScript);

  htmlContent = htmlContent.replace('// script-placeholder', scriptContent + '\n' + restoreScript);
  // console.log(htmlContent);
  return htmlContent;
}
