import { OpenAIService } from './../openai/openai.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import ConfigKey from '@/common/config/config-key';

@Injectable()
export class PineconeService {
    pinecone: Pinecone;
    documentIndex: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly openAIService: OpenAIService,
    ) {
        const apiKey = this.configService.get(ConfigKey.PINECONE_KEY);
        const documentIndex = this.configService.get(
            ConfigKey.PINECONE_DOCUMENT_INDEX,
        );
        this.pinecone = new Pinecone({
            apiKey,
        });
        this.documentIndex = documentIndex;
    }
    async insertEmbedding(id: string, values: number[]) {
        await this.pinecone.index(this.documentIndex).upsert([{ id, values }]);
    }

    async queryVectorIndex(query: string) {
        const index = this.pinecone.index(this.documentIndex);

        const vector = await this.openAIService.getVectorEmbedding(query);

        const response = await index.query({
            vector,
            topK: 1,
            includeMetadata: true,
        });

        return response.matches[0].id;
    }

    async deleteEmbedding(id: string) {
        await this.pinecone.index(this.documentIndex).deleteOne(id);
    }
}
