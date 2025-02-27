import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import dbConfig from './core/config/database';
import { AuthModule } from './modules/auth';
import { UsersModule } from './modules/users';

const { combine, timestamp, colorize, align, printf } = winston.format;
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    WinstonModule.forRoot({
      format: combine(
        colorize(),
        timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        align(),
        printf((info) => {
          return `${info.timestamp} - [${info.level}] ${info.message}`;
        }),
      ),
      transports: [new winston.transports.Console({ level: 'debug' })],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Disable in production
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
