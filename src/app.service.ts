import { Injectable } from '@nestjs/common';
import * as WS from 'ws';

@Injectable()
export class AppService {
  getHello(): string {
    return `hello  ${process.env.var}!`;
  }
}
