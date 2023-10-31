import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { apiMappings } from '../apis/apiNameMappings';
import { getNonce, saveDroppedItem } from './common/helper';

// Import the interface


export function createDashboard(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'dashboard', 'Dashboard',
    vscode.ViewColumn.One,{ enableScripts: true }
  );

  console.log(context.globalState.get('droppedItems', []));

  const htmlFilePath = path.join(context.extensionPath, 'src', 'webview', 'index.html');
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

  const styleFilePath = path.join(context.extensionPath, 'src', 'webview', 'styles', 'style.css');
  const styleContent = fs.readFileSync(styleFilePath, 'utf8');

  const scriptFilePath = path.join(context.extensionPath, 'src', 'webview', 'scripts', 'main.js');
  const scriptContent = fs.readFileSync(scriptFilePath, 'utf8');

  const nonce = getNonce();

  // Now create dropdown options using the apiMappings
  const dropdownOptions = Object.entries(apiMappings).map(([key, value]) => `<option value="${value}">${key}</option>`).join('');

  // Find and replace the placeholder in your HTML with the created dropdown options
  htmlContent = htmlContent.replace(/<select>(.*?)<\/select>/gs, `<select>$1${dropdownOptions}</select>`);
  // Replace placeholders in the HTML content
  htmlContent = htmlContent.replace('/* style-placeholder */', styleContent);
  htmlContent = htmlContent.replace('// script-placeholder', scriptContent);
  htmlContent = htmlContent.replace(/\${nonce}/g, nonce);

  const droppedItems = context.globalState.get('droppedItems', []);

  panel.webview.html = getWebviewContent(htmlContent, nonce, droppedItems, scriptContent);

  panel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'saveDroppedItem':
          saveDroppedItem(context, message.data);
          return;
      } 
    },
    undefined,
    context.subscriptions
  );


  // console.log(htmlContent);
  panel.webview.html = htmlContent;
}




// function saveDroppedItem(context: vscode.ExtensionContext, data: any) {
//   let droppedItems: any = context.globalState.get('droppedItems', []);
  
//   // Update or add new item to the droppedItems
//   const existingIndex = droppedItems.findIndex(item => item.id === data.id);
//   if (existingIndex !== -1) {
//     droppedItems[existingIndex] = data;
//   } else {
//     droppedItems.push(data);
//   }
  
//   context.globalState.update('droppedItems', droppedItems);
// }

function getWebviewContent(htmlContent: string, nonce: string, droppedItems: any[], scriptContent: string): string {
  // Inject nonce and other dynamic values into the HTML content
  // ...

  // Send a message to the webview with the dropped items
  const scriptContentWithDroppedItems = scriptContent.replace('/* dropped-items-placeholder */', `const droppedItems = ${JSON.stringify(droppedItems)};`);

  htmlContent = htmlContent.replace('// script-placeholder', scriptContentWithDroppedItems);
  return htmlContent;
}
