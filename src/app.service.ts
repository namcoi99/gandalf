import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    pingAlive(): string {
        return 'pong';
    }
}
