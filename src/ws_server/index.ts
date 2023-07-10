import { WebSocketServer, WebSocket, createWebSocketStream } from 'ws';
import { handleCommands } from '../commands/commandParser';
import { WebSocketWithId } from '../models/types';
import {  Database } from '../models/Database';

export const wsServer = (port: number, db: Database): WebSocketServer => {
  console.log(`Start WebSocket server on port ${port}.`);
  const connections = new Map<number, WebSocket>();

  const wss = new WebSocket.Server({ port });
  let nextConnectionId = 1;

  wss.on('connection', async (ws: WebSocketWithId) => {
    const connectionId = nextConnectionId++;
    connections.set(connectionId, ws);

    ws.connectionId = connectionId;
    console.log(`WebSocket client ${connectionId} connected to server`);

    const duplex = createWebSocketStream(ws, {
      decodeStrings: false,
      encoding: 'utf-8',
    });

    duplex.on('data', async (command: string) => {
      try {
        // console.log(`\nCommand received: ${command}`);
        handleCommands(ws, db, command);
      } catch (error: unknown) {
        console.error(error);
      }
    });

    ws.on('close', () => {
      db.disconnectPlayer(ws.connectionId);
      console.log(
        `Player ${ws.connectionId} has been disconnected from server.`,
      );
    });
  });

  return wss;
};
