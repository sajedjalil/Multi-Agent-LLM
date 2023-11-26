import { APIClients } from "../apis/apiClients";

export async function verification(requirement:string, content: string, language: string, apiClients: APIClients, model: string): Promise<string> {
    const formattedContent = 'Lets assume we have the following requirements for '+language+'programming language :\n'
        + requirement + '\n'
        +'Now we have the following source code: \n'
        +content
        +'\nCan you verify if the source code meets the requirement? Answer with yes if it meets the requirement and provide the correct source code if it does not.';

    // console.log(formattedContent);
    const apiResponse = await apiClients.chat(formattedContent, model );
    
    if(apiResponse.toLowerCase().includes('yes')){
        return content;
    } 
    else return apiResponse;
}
