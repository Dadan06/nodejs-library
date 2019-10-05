import { Request } from 'express';
import { Server } from 'http';
import * as httpMocks from 'node-mocks-http';
import * as passport from 'passport';
import * as SocketIo from 'socket.io';
import { Message } from '../message/message.model';
import { messageRepository } from '../message/message.repository';
import { userRepository } from '../user/user.repository';
import { logger } from './app.logger';

export enum WebSocketEvent {
    CONNECTION = 'connection',
    MESSAGE = 'message',
    MESSAGES = 'messages',
    NOTIFICATION = 'notification'
}

class WebSocket {
    onConnectionHandlers: ((socket: SocketIo.Socket) => void)[] = [];
    private io = SocketIo.listen();

    init(srv: Server) {
        logger.info('Initializing websocket');
        this.io = SocketIo.listen(srv);
        this.io.use(this.jwtAuthMiddleware.bind(this));
        this.setOnConnectionHandler();
    }

    private jwtAuthMiddleware(socket: SocketIo.Socket, next: (e?: Error) => void) {
        const token = socket.handshake.query.token;
        const req: Request = httpMocks.createRequest({ params: { token } });
        passport.authenticate('jwt', { session: false }, (err, retUser, info) => {
            if (err || !retUser) {
                logger.warn(`Unauthorized websocket connection`);
                next(new Error('not authorized'));
            } else {
                next();
            }
        })(req);
    }

    private setOnConnectionHandler() {
        this.io.on(WebSocketEvent.CONNECTION, socket => {
            this.onConnectionHandlers.forEach(handler => {
                handler(socket);
            });
            const userId = socket.handshake.query.userId;
            const socketId = socket.id;
            logger.info(`New websocket connexion, userId: ${userId}, socketId: ${socketId}`);
            userRepository.update(userId, { socketId });
            this.setOnMessageHandler(socket);
            this.sendUndeliveredMessages(userId, socket);
        });
    }

    private async sendUndeliveredMessages(userId: string, socket: SocketIo.Socket) {
        logger.info(`Resending undelivered messages to: ${userId}`);
        const reconnectedUserId = await userRepository.getSocketOwnerId(socket.id);
        const undeliveredMessages =
            reconnectedUserId &&
            (await messageRepository.getUndeliveredMessages(reconnectedUserId));
        if (undeliveredMessages && undeliveredMessages.length) {
            socket.emit(WebSocketEvent.MESSAGES, undeliveredMessages, () => {
                undeliveredMessages.forEach((m: Message) =>
                    messageRepository.setMessageAsDelivered(m.id)
                );
            });
        }
    }

    private setOnMessageHandler(socket: SocketIo.Socket) {
        socket.on(WebSocketEvent.MESSAGE, (message: Message) => {
            this.sendMessage(message);
        });
    }

    onConnection(handler: (socket: SocketIo.Socket) => void) {
        this.onConnectionHandlers.push(handler);
    }

    // tslint:disable-next-line:no-any
    broadcast(type: WebSocketEvent, payload: any) {
        logger.info(`Webscoket Broadcast, type: ${type}`);
        this.io.emit(type, payload);
    }

    // tslint:disable-next-line:no-any
    multicast(type: WebSocketEvent, payload: any, recipientsId: string[]) {
        /* Broadcast */
    }

    async sendMessage(message: Message) {
        logger.info(`Sending message from ${message.from} to: ${message.to}`);
        message.date = new Date();
        message.delivered = false;
        const { _id: messageId } = await messageRepository.create(message);
        const recipientSocketId = await userRepository.getSocketId(message.to);
        const recipientSocket = recipientSocketId && this.io.sockets.connected[recipientSocketId];
        recipientSocket &&
            recipientSocket.emit(WebSocketEvent.MESSAGE, message, () => {
                messageRepository.setMessageAsDelivered(messageId);
            });
    }
}

export const webSocket = new WebSocket();
