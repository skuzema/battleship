import {
  WebSocketWithId,
  RegRequestData,
  RegResponseData,
} from '../models/types';
import { sendRegResponse, sendUpdateRoomState } from './messageSender';
import { Database } from '../models/Database';

export function handleRegistration(
  ws: WebSocketWithId,
  db: Database,
  body: string,
) {
  try {
    console.log('ws.id:', ws.connectionId);
    console.log('body:', body);
    const req: RegRequestData = JSON.parse(body);
    const player: RegResponseData = db.createPlayer(ws, req.name, req.password);
    console.log(`handleRegistration, player: ${JSON.stringify(player)}`);
    sendRegResponse(ws, player);
    // sendUpdateRoomState(db);
    return;
  } catch (error) {
    console.error(error);
    return;
  }
}

export function handleCreateRoom(ws: WebSocketWithId, db: Database) {
  try {
    console.log('handleCreateRoom, ws.id:', ws.connectionId);
    db.createRoom(ws);
    sendUpdateRoomState(db);
  } catch (error) {
    console.error(error);
  }
}
