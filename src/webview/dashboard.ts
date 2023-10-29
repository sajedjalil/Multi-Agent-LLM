import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { IDropdownItem } from './IDropdownItem';
// Import the interface

// Now you can use IDropdownItem in this file
let dropZoneItems: IDropdownItem[] = [];

export function createDashboard(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'dashboard',
    'Dashboard',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      // other webview options...
    }
  );

  const htmlFilePath = path.join(context.extensionPath, 'src', 'webview', 'index.html');
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

  const styleFilePath = path.join(context.extensionPath, 'src', 'webview', 'styles', 'style.css');
  const styleContent = fs.readFileSync(styleFilePath, 'utf8');

  const scriptFilePath = path.join(context.extensionPath, 'src', 'webview', 'scripts', 'main.js');
  const scriptContent = fs.readFileSync(scriptFilePath, 'utf8');

  const nonce = getNonce();

  // Replace placeholders in the HTML content
  htmlContent = htmlContent.replace('/* style-placeholder */', styleContent);
  htmlContent = htmlContent.replace('// script-placeholder', scriptContent);
  htmlContent = htmlContent.replace(/\${nonce}/g, nonce);

  // console.log(htmlContent);
  panel.webview.html = htmlContent;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
