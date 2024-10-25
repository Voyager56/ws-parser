import { Injectable } from '@nestjs/common';
import * as WS from 'ws';
import { CryptoApi } from '../enums/crypto-api';
import { CoinCap } from './clients/CoinCap';
import { Coins } from '../enums/coins';
import { Test } from './clients/Test';

export class PriceFetcherSDK {
  private selectedCoins = [];
  private apiClients = {
    coincap: new CoinCap(this.selectedCoins),
    test: new Test(),
  };
  private selectedApi: CryptoApi = CryptoApi.CoinCap;
  private wss = new WS.WebSocketServer({ port: 8080 });
  private wssClients: WS[] = [];

  constructor() {
    Object.values(this.apiClients).forEach((clientClass) => {
      clientClass.listen();
    });
    this.wss.on('connection', (ws) => {
      ws.on('message', (d: Buffer) => {
        // check if the message is in a valid coin format
        const coins = d.toString().split(',');
        const validCoins = coins.filter((coin) =>
          Object.values(Coins).includes(coin as Coins),
        );
        console.log(validCoins);
        if (validCoins.length > 0) {
          this.setCoins(validCoins as Coins[]);
        }
        this.logCurrentClient();
      });
      this.wssClients.push(ws);
    });
  }

  public getCurrentClientClass() {
    return this.apiClients[this.selectedApi];
  }

  public logCurrentClient() {
    const wsClient = this.getCurrentClientClass().getClient();
    wsClient.on('message', (data) => {
      const jsonData = JSON.parse(data.toString());
      console.log(jsonData);
      this.wssClients.forEach((ws) => {
        Object.keys(jsonData).forEach((key) => {
          ws.send(JSON.stringify({ [key]: jsonData[key] }));
        });
      });
    });
  }

  public changeClient(api: CryptoApi) {
    this.selectedApi = api;
    this.logCurrentClient();
  }

  public setCoins(coins: Coins[]) {
    this.selectedCoins = [...this.selectedCoins, ...coins];
    for (let key in this.apiClients) {
      this.apiClients[key].setCoins(this.selectedCoins);
    }
  }
}
