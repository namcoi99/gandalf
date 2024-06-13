import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import ConfigKey from './common/config/config-key';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.use(helmet());

    // CORS setting
    const whiteList = configService.get(ConfigKey.CORS_WHITELIST) || '*';
    const corsOptions: CorsOptions = {
        origin:
            whiteList?.split(',')?.length > 1
                ? whiteList.split(',')
                : whiteList,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Language',
            'X-Timezone',
            'X-Timezone-Name',
            'hotelId',
            'idToken',
        ],
        optionsSuccessStatus: 200,
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    };
    app.enableCors(corsOptions);

    // setup prefix of route
    app.setGlobalPrefix(configService.get(ConfigKey.BASE_PATH));
    await app.listen(configService.get(ConfigKey.PORT));
}
bootstrap();
