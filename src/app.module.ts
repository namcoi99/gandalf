import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './common/config/validation-schema';
import { OpenAIService } from './modules/openai/openai.service';
import { PineconeService } from './modules/pinecone/pinecone.service';
import { FirebaseService } from './modules/firebase/firebase.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema,
        }),
    ],
    controllers: [AppController],
    providers: [AppService, OpenAIService, PineconeService, FirebaseService],
})
export class AppModule {}
