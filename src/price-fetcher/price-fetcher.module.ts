import { Module } from '@nestjs/common';
import { PriceFetcherService } from './price-fetcher.service';
import { PriceFetcherSDK } from './api/sdk';

@Module({
  providers: [PriceFetcherService, PriceFetcherSDK],
})
export class PriceFetcherModule {}
