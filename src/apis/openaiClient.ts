import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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', timeout: 10000
});

export async function chat(content: string, model: string): Promise<string> {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: content }],
        model: model,
    });
    return chatCompletion.choices[0].message.content || chatCompletion.choices[0].finish_reason;
}

