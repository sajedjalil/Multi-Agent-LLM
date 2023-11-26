import * as vscode from 'vscode';
import { getComments } from './common/helper';

// Regular expression for Java single-line comments
const singleLineCommentRegex = /^\s*\/\/.*/;
// Regular expression for Java multi-line string literals used as comments
const multiLineCommentRegex = /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g;

export class JavaCodeLensProvider implements vscode.CodeLensProvider {
  // This method will generate CodeLens items
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = getComments(document, new vscode.CancellationTokenSource().token, {singleLineCommentRegex, multiLineCommentRegex});
    return codeLenses;
  }

}
