import axios from 'axios';
import { APIClients } from './apiClients';

export class AI21Client implements APIClients{
    private readonly API_ENDPOINT = 'https://api.ai21.com/studio/v1/';

    private readonly headers = {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "Bearer TvoeIumebSJT3LEKwOoXwrxEGsJHVfLH"
    };

    async chat(content: string, model: string): Promise<string> {

        const payload = {
            numResults: 1,
            messages: [
                {
                    text: content,
                    role: "user"
                }
            ],
            system: "You are an AI assistant code generation. Your responses should be informative and concise."
        };

        try {
            const response = await axios.post(this.API_ENDPOINT+model+'/chat', payload, { headers: this.headers });
            console.log(response.data.outputs[0].text);
            return response.data.outputs[0].text;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error Response:', error.response.data);
                console.error('Status Code:', error.response.status);
            } else {
                console.error('Error:', error);
            }
            throw error;
        }
    }
}
