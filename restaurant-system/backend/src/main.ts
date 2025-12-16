import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Enable CORS for local development and production
  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins = [
    'http://localhost:3001', // Admin Panel
    'http://localhost:3002', // Kitchen Display
    'http://localhost:3003', // Customer Menu
    'http://localhost:3004', // Customer Menu (alternative port)
    'http://localhost:3005', // Cashier Terminal
    // Allow local network access (for mobile testing)
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d{4}$/, // 192.168.x.x
    /^http:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{4}$/, // 172.x.x.x
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{4}$/, // 10.x.x.x
  ];
  
  // Support multiple production URLs (comma-separated)
  if (frontendUrl) {
    const urls = frontendUrl.split(',').map(url => url.trim());
    allowedOrigins.push(...urls);
  }
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📱 Mobile access: http://172.20.10.2:${port}/api`);
}
bootstrap();
