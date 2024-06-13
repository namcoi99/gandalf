import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import ConfigKey from '@/common/config/config-key';

@Injectable()
export class OpenAIService {
    openai: OpenAI;
    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get(ConfigKey.OPENAI_KEY);
        this.openai = new OpenAI({
            apiKey,
        });
    }
    async getVectorEmbedding(text: string) {
        const vectorModel = this.configService.get(ConfigKey.VECTOR_MODEL);

        const result = await this.openai.embeddings.create({
            input: text,
            model: vectorModel,
        });
        return result.data[0].embedding;
    }

    async createCompletions(
        content: string,
        question: string,
    ): Promise<string> {
        const prompt = `Given a document, answer a question about the document
    Do not include any other information. Only include the information that is
    in the document in the answer. If there is a question that 
    cannot be answered, please say that there isn't enough information.

    Document: ${content}

    Question: ${question}`;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        });

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt,
            temperature: 0.3,
            stream: false,
            max_tokens: 1000,
        });

        const answer = response.choices[0].text;
        return answer;
    }
}
