import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Price } from 'src/price/types';
import { GameRoundCancelData, GameRoundEndData } from './types';
import { AuthService } from 'src/auth/auth.service';
import * as cookie from 'cookie';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
})
export class WebsocketsService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketsService.name);

  @WebSocketServer()
  server: Server;
    
  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket): Promise<void> {
    const rawCookie = client.handshake.headers.cookie;

    if (rawCookie) {
      const parsedCookie = cookie.parse(rawCookie);

      if (parsedCookie.accessToken) {
        const data = await this.authService.verifyToken(
          parsedCookie.accessToken,
        );

        client.join(`user_${data.uuid}`);
      }
    }

    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  broadcastPriceUpdate(price: Price) {
    this.server.emit('priceUpdated', price);
  }

  broadcastGameRoundEnd(gameRoundEndData: GameRoundEndData) {
    this.server
      .to(`user_${gameRoundEndData.gameRound.userId}`)
      .emit('gameRoundEnd', gameRoundEndData);
  }

  broadcastGameRoundCancel(gameRoundCancelData: GameRoundCancelData) {
    this.server
      .to(`user_${gameRoundCancelData.gameRound.userId}`)
      .emit('gameRoundCancel', gameRoundCancelData);
  }
}
