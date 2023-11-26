import { APIClients } from "../apis/apiClients";

export async function bestResponse(requirement:string, content: string, language: string, apiClients: APIClients, model: string): Promise<string> {
    const formattedContent = 'Lets assume we have the following requirements for '+language+'programming language :\n'
        + requirement + '\n'
        +'Now we have the following response options: \n'
        +content
        +'\nCan you select and output the the best response from them considering the requirement? Only include the source code in the response.';

    console.log(formattedContent);
    const apiResponse = await apiClients.chat(formattedContent, model );
    // console.log(apiResponse);
    return apiResponse;
}