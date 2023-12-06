import * as vscode from 'vscode';
import { DropdownItem } from '../webview/dropdownItem';
import { OpenAIClient } from '../apis/openaiClient';
import { MakersuitClient } from '../apis/makersuitClient';
import { APIClients } from '../apis/apiClients';
import { rephrase } from './rephrase';
import { generateCode } from './codeGeneration';
import { bestResponse } from './bestResponseSelection';
import { AI21Client } from '../apis/ai21';
import { CohereClient } from '../apis/cohereClient';
import { verification } from './verification';
import { polishVariables } from './polishVariables';


export class Workflow {
    dashboard: typeof DropdownItem[];
    language: string = '';
    initialText: string = '';
    constructor(context: vscode.ExtensionContext, currentText: string) {
        this.dashboard = context.globalState.get('droppedItems', []);
        this.language = vscode.window.activeTextEditor?.document.languageId || '';
        this.initialText = currentText;
    }

    public async run(): Promise<String> {
        
        for (const item of this.dashboard) {
            const apiClass = getAPIClass(item);
            if (item.column.includes('1')) {
                if (apiClass) {
                    //replace the 0th poistion in results with await rephrase(this.initialText, this.language, apiClass, item.value)
                    this.initialText = await rephrase(this.initialText, this.language, apiClass, item.value);
                    vscode.window.showInformationMessage('Rephrasing Completed!');
                    break;
                }
            }
        }

        
        let results: string[] = [];
        let tempResults: string[] = [];
        for (const item of this.dashboard) {
            const apiClass = getAPIClass(item);
            if (item.column.includes('2')) {
                if (apiClass) {
                    tempResults.push(await generateCode(this.initialText, this.language, apiClass, item.value));
                }
            }
        }
        //make a new copy of the tempResults and replace into results
        results.push(this.initialText);
        results = results.concat([...tempResults]);

        vscode.window.showInformationMessage('Code Generation Completed!');

        if( results.length > 2){ // Only when there is more than 2 model in the code generation section
            tempResults = [];
            tempResults.push(results[0]);

            for (const item of this.dashboard) {
                const apiClass = getAPIClass(item);
                if (item.column.includes('3')) {
                    if (apiClass) {

                        // append all the result into a single string. Run the loop from the second element
                        let content = '';
                        for (let i = 1; i < results.length; i++) {
                            content += 'Option '+i+':\n'+results[i]+'\n\n---------------------\n\n';
                        }
                        tempResults.push(await bestResponse(results[0], content, this.language, apiClass, item.value));
                        console.log('Best Response Selection Step:\n\n'+tempResults[1]+"\n\n---------------------\n\n");
                        vscode.window.showInformationMessage('Best Response Selection Completed!');
                        break;
                    }
                }
            }
        }
        //make a new copy of the tempResults and replace into results
        results = [...tempResults];

        tempResults = [];
        tempResults.push(results[0]);
        for (const item of this.dashboard) {
            const apiClass = getAPIClass(item);
            if (item.column.includes('4')) {
                if (apiClass) {
                    const response = await verification(results[0], results[1], this.language, apiClass, item.value);
                    if( response !== results[1]){
                        tempResults.push(response);
                    }
                }
            }
        }
        
        // Means there is at least one verification model that says no to the generated code. 
        if(tempResults.length > 1){
            results = [...tempResults];
        }
        vscode.window.showInformationMessage('Verification Completed!');
        
        tempResults = [];
        tempResults.push(results[0]);
        for (const item of this.dashboard) {
            const apiClass = getAPIClass(item);
            if (item.column.includes('5')) {
                if (apiClass) {
                    tempResults.push(await polishVariables(results[0], results[1], this.language, apiClass, item.value));
                    vscode.window.showInformationMessage('Variable Polishing Completed!');
                    break;
                }
            }
        }
        
        results = [...tempResults];
        

        // concate the results into a single string
        let finalResult = '';
        for (const result of results) {
            finalResult += '\n\n'+result;
        }

        return finalResult.trim();
    }

    async getCurrentRephraseModelResult(): Promise<string | undefined> {
        for (const item of this.dashboard) {
            const apiClass = getAPIClass(item);
            if (item.column.includes('1')) {
                if (apiClass) {
                    //replace the 0th position in results with await rephrase(this.initialText, this.language, apiClass, item.value)
                    return Promise.resolve((await rephrase(this.initialText, this.language, apiClass, item.value)).trim());
                }
            }
        }

        return undefined;
    }
    
}

export function getAPIClass(item: typeof DropdownItem): APIClients | undefined{

    const apiClass ={'GPT':new OpenAIClient(), 'Bard': new MakersuitClient(), 
                    'AI21': new AI21Client(), 'Cohere': new CohereClient()};

    for (const key in apiClass) {
        // check if the item's label contains the key
        if (item.label.includes(key)) {
            return apiClass[key as keyof typeof apiClass];
        }
    }
}
