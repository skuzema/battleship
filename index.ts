import dotenv from 'dotenv';
import { httpServer } from './src/http_server/index';
import { wsServer } from './src/ws_server/index';
import { db } from './src/models/db_init';

dotenv.config();
const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WS_PORT = process.env.WS_PORT || '3000';

console.log(`Start static http server on the ${HTTP_PORT} port!`);
const httpServerConst = httpServer.listen(HTTP_PORT);
const wsServerConst = wsServer(Number.parseInt(WS_PORT), db);

process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Application closed.');
  httpServerConst.close();
  wsServerConst.close();
  process.exit();
});
