import axios from 'axios';
import { APIClients } from './apiClients';

export class CohereClient implements APIClients{
    private readonly API_ENDPOINT = 'https://api.cohere.ai/v1/chat';

    async chat(content: string, model: string): Promise<string> {
        const options = {
            method: 'POST',
            url: this.API_ENDPOINT,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Bearer FqjpKfABonumCPFQ4fGWjAcnAoVcQVjaXTAXWKi9'
            },
            data: {
                message: content,
                model: model,
                stream: false
            }
        };

        return axios.request(options).then(function (response) {
            console.log(response.data.text);
            return response.data.text;
        }).catch(function (error) {
            console.error(error);
            throw error;
        });
    }
}
