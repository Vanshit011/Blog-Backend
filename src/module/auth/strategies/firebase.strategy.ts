import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: FirebaseApp;
  private firebaseAuth: Auth;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const firebaseConfig = {
      apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.configService.get<string>(
        'FIREBASE_MESSAGING_SENDER_ID',
      ),
      appId: this.configService.get<string>('FIREBASE_APP_ID'),
      measurementId: this.configService.get<string>('FIREBASE_MEASUREMENT_ID'),
    };

    this.firebaseApp = initializeApp(firebaseConfig);
    this.firebaseAuth = getAuth(this.firebaseApp);
  }

  getAuth(): Auth {
    return this.firebaseAuth;
  }
}
