import { Coins } from 'src/price-fetcher/enums/coins';
import * as WS from 'ws';

export class CoinCap {
  public client: WS = null;
  private coins: Coins[] = [];
  private lastPrices: any = {};

  constructor(private readonly c: Coins[]) {
    console.log('creating CoinCap client');
    this.coins = c;
    const args = this.coins.map((coin) => coin.toString().toLowerCase());
    if (!this.client)
      this.client = new WS(`wss://ws.coincap.io/prices?assets=${args}`);
  }

  public listen(): void {
    this.client.on('open', () => {
      console.log('connected to CoinCap');
    });
    this.client.on('message', (data) => {
      const keys = Object.keys(JSON.parse(data.toString()));
      for (const key of keys) {
        this.lastPrices[key] = JSON.parse(data.toString())[key];
      }
    });
  }

  public getClient(): WS {
    return this.client;
  }

  public getLastPrices(): any {
    return this.lastPrices;
  }

  public setCoins(coins: Coins[]): void {
    this.coins = coins;
    const args = this.coins.map((coin) => coin.toString().toLowerCase());
    this.client = new WS(`wss://ws.coincap.io/prices?assets=${args}`);
  }
}
