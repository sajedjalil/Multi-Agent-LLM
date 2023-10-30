import * as vscode from 'vscode';


export function getComments(document: vscode.TextDocument, token: vscode.CancellationToken, {singleLineCommentRegex, multiLineCommentRegex}: any): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();
    let match;

    // Find single-line comments
    for (let i = 0; i < document.lineCount; i++) {
      const lineOfText = document.lineAt(i);
      if (singleLineCommentRegex.test(lineOfText.text)) {
        const range = new vscode.Range(i, 0, i, lineOfText.text.length);
        codeLenses.push(createCodeLens(document, range));
      }
    }

    // Find multi-line comments
    while (match = multiLineCommentRegex.exec(text)) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(startPos, endPos);
      codeLenses.push(createCodeLens(document, range));
    }

    return codeLenses;
  }



function createCodeLens(document: vscode.TextDocument, range: vscode.Range): vscode.CodeLens {
    return new vscode.CodeLens(range, {
        title: "Run",
        command: "multi-agent-llm.runCommentCode",
        arguments: [document, range]
    });
}