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
  const droppedItems: any = context.globalState.get('droppedItems', []);
  const dropdownItem: typeof DropdownItem = item;
  let isItemAlreadyDropped = false;

  // Iterate through the array with a standard for loop
  for (let i = 0; i < droppedItems.length; i++) {
      if (droppedItems[i].id === dropdownItem.id) {
          // Directly update the item in the array
          droppedItems[i] = dropdownItem;
          isItemAlreadyDropped = true;
          break; // Break the loop as the item has been found and updated
      }
  }

  if (!isItemAlreadyDropped) {
      droppedItems.push(dropdownItem);
  }

  context.globalState.update('droppedItems', droppedItems);
}



export function removeDroppedItem(context: vscode.ExtensionContext, item: any) {
  const droppedItems: any = context.globalState.get('droppedItems', []);

  // Iterate through the array with a standard for loop
  for (let i = 0; i < droppedItems.length; i++) {
      if (droppedItems[i].id === item.id) {
          droppedItems.splice(i, 1);
          break; // Break the loop as the item has been found and removed
      }
  }
  context.globalState.update('droppedItems', droppedItems);
}