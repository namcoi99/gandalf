import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import ConfigKey from '@/common/config/config-key';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import firebase from 'firebase-admin';

@Injectable()
export class FirebaseService {
    firestore: Firestore;
    constructor(private readonly configService: ConfigService) {
        const firebaseCredentials = JSON.parse(
            this.configService.get(
                ConfigKey.GOOGLE_FIREBASE_APPLICATION_CREDENTIALS,
            ),
        );
        firebase.initializeApp({
            credential: firebase.credential.cert(firebaseCredentials),
        });
        this.firestore = getFirestore();
    }
}
