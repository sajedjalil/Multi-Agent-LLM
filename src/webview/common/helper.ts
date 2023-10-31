import * as vscode from 'vscode';
import { DropdownItem } from '../dropdownItem';

export function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
  
export function saveDroppedItem(context: vscode.ExtensionContext, item: any) {
    console.log(item);
    
    const droppedItems: any = context.globalState.get('droppedItems', []);
    const dropdownItem: typeof DropdownItem = item;
    droppedItems.push(dropdownItem);
    context.globalState.update('droppedItems', droppedItems);
}