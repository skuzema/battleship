import { WebSocketServer, WebSocket, createWebSocketStream } from 'ws';

export const wsServer = (port: number): WebSocketServer => {
  console.log(`Start WebSocket server on the ${port} port!`);

  const wss = new WebSocket.Server({ port });

  wss.on('connection', async (ws: WebSocket) => {
    console.log('WebSocket client connected');

    const duplex = createWebSocketStream(ws, {
      decodeStrings: false,
      encoding: 'utf-8',
    });

    duplex.on('data', async (command: string) => {
      try {
        console.log(`\nCommand received: ${command}`);
        // const [parseCommand, ...args] = command.split(' ');
        
      } catch (error: unknown) {
        console.error(error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client hes been disconnected from server.');
    });
  });

  return wss;
};
