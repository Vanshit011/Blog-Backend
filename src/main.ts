import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getPort from 'get-port';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 🔥 AUTO PORT FIX (no more EADDRINUSE)
  const port = await getPort({
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  });

  await app.listen(port);

  // console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap().catch((err: unknown) => console.error(err));
