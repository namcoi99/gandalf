import { FirebaseService } from './modules/firebase/firebase.service';
import { PineconeService } from './modules/pinecone/pinecone.service';
import { OpenAIService } from './modules/openai/openai.service';
import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { getFileContent } from './common/helpers';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly openAIService: OpenAIService,
        private readonly pineconeService: PineconeService,
        private readonly firebaseService: FirebaseService,
    ) {}

    @Get('ping')
    ping(): string {
        return this.appService.pingAlive();
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('upload-file')
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const { buffer } = file;
        const fileContent = await getFileContent(Buffer.from(buffer));

        for (const content of fileContent) {
            if (!content) {
                continue;
            }
            // Insert the page into firestore
            const firestoreDocument = await this.firebaseService.firestore
                .collection('pages')
                .add({ content });

            // get the page embedding from OpenAI
            const embedding =
                await this.openAIService.getVectorEmbedding(content);

            await this.firebaseService.firestore
                .collection('embeddings')
                .doc(firestoreDocument.id)
                .set({ embedding });

            // insert the page embedding into Pinecone,
            // mapped to the firestore document id
            await this.pineconeService.insertEmbedding(
                firestoreDocument.id,
                embedding,
            );
        }
        return 'success';
    }

    @Post('ask-question')
    async askQuestion(@Body() body: { question: string }) {
        const { question } = body;
        const id = await this.pineconeService.queryVectorIndex(question);

        const doc = await this.firebaseService.firestore
            .collection('pages')
            .doc(id)
            .get();

        const documentId = doc.id;

        const answer = this.openAIService.createCompletions(
            doc.data()?.content,
            question,
        );

        return { answer, question, documentId };
    }
}
