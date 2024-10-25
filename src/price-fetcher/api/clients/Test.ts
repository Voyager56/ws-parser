import * as WS from 'ws';

export class Test {
  public client: WS = null;

  public getClient(): WS {
    return this.client;
  }

  public listen() {
    setTimeout(() => {
      console.log('listening to test');
    }, 10000);
  }

  public setCoins() {
    console.log('setting coins for test');
  }
}
