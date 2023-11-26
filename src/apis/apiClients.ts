export interface APIClients {
    chat(content: string, model: string): Promise<string>;
}