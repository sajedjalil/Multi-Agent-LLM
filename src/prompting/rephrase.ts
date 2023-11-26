import { APIClients } from "../apis/apiClients";

export async function rephrase(content: string, language: string, apiClients: APIClients, model: string): Promise<string> {
    const formattedContent = 'Lets assume we have the following docstring in '+language+' programming language.\n'
        +content
        +'\nCan you to rephrase it better? Only include the docstring, not the code';

    // console.log(formattedContent);
    const apiResponse = await apiClients.chat(formattedContent, model );
    // console.log(apiResponse);
    return apiResponse;
}