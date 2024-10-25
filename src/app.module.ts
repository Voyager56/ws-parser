import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PriceFetcherModule } from './price-fetcher/price-fetcher.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    PriceFetcherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
