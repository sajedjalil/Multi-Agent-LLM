import { APIClients } from '../apis/apiClients';

export async function generateCode(content: string, language: string, apiClients: APIClients, model: string): Promise<string> {
    const formattedContent = 'Lets assume we have the following docstring in '+language+' programming language.\n'
        +content
        +'\nGenerate code for the following docstring. Only include the source code in the response.';

    const apiResponse = await apiClients.chat(formattedContent, model);
    return apiResponse;
}
