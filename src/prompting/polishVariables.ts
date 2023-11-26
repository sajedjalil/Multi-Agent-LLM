import { APIClients } from "../apis/apiClients";

export async function polishVariables(requirement:string, content: string, language: string, apiClients: APIClients, model: string): Promise<string> {
    const formattedContent = 'Lets assume we have the following requirements for '+language+'programming language :\n'
        + requirement + '\n'
        +'Now we have the following code: \n'
        +content
        +'\nCan you refactor the variable names in the code for better understandability?';

    console.log(formattedContent);
    const apiResponse = await apiClients.chat(formattedContent, model );
    // console.log(apiResponse);
    return apiResponse;
}