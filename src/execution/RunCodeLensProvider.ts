import * as vscode from 'vscode';

export class RunCodeLensProvider implements vscode.CodeLensProvider {
  // This method will generate CodeLens items
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    // Define lines where you want to show the CodeLens
    const linesWithCodeLens = [2, 5, 8]; // Example line numbers (zero-based)
    
    // Generate a CodeLens for each line
    return linesWithCodeLens.map(line => {
      const range = new vscode.Range(line, 0, line, 10000);
      const command = {
        title: "Run", // The text shown in the editor
        command: "multi-agent-llm.runCode", // The command to execute on click
        arguments: [document, line] // Arguments to pass to the command
      };
      return new vscode.CodeLens(range, command);
    });
  }
}
