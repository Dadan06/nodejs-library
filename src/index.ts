import { app } from './app/app';

import { logger } from './app/app.logger';
import { config } from './app/app.config';
import { database } from './app/app.database';
import { webSocket, WebSocketEvent } from './app/app.websocket';

logger.info('Starting application ...');

database.connect(() => {
    const srv = app.init(config.server.port);
    webSocket.init(srv);
    // Websocket broadcast example:
    webSocket.onConnection(socket => {
        const userId = socket.handshake.query.userId;
        webSocket.broadcast(WebSocketEvent.NOTIFICATION, `New connection, clientId: ${userId}`);
    });
});
