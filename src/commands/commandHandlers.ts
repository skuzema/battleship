import {
  WebSocketWithId,
  RegRequestData,
  RegResponseData,
  AddPlayerToRoomRequestData,
} from '../models/types';
import {
  sendRegResponse,
  sendUpdateRoomState,
  sendCreateGame,
} from './messageSender';
import { Database } from '../models/Database';
import { Game } from 'models/Game';

export function handleRegistration(
  ws: WebSocketWithId,
  db: Database,
  body: string,
) {
  try {
    console.log(`handleRegistration: ws.id:${ws.connectionId}, body:${body}`);
    const req: RegRequestData = JSON.parse(body);
    const player: RegResponseData = db.createPlayer(ws, req.name, req.password);
    sendRegResponse(ws, player);
    sendUpdateRoomState(db);
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

export function handleAddUserToRoom(
  ws: WebSocketWithId,
  db: Database,
  body: string,
) {
  try {
    console.log(`handleAddUserToRoom: ws.id:${ws.connectionId}, body:${body}`);
    const req: AddPlayerToRoomRequestData = JSON.parse(body);
    const game: Game | null = db.addPlayerToRoom(
      req.indexRoom,
      ws.connectionId,
    );
    if (game) {
      sendCreateGame(game);
    }
    sendUpdateRoomState(db);
  } catch (error) {
    console.error(error);
  }
}

export function handleAddShips(ws: WebSocketWithId, db: Database, body: string) {
  try {
    console.log(`handleAddShips: ws.id:${ws.connectionId}, body:${body}`);
    const req: AddShipsRequestData = JSON.parse(body);
    const game: Game | null = db.addPlayerToRoom(
      req.indexRoom,
      ws.connectionId,
    );
    if (game) {
      sendCreateGame(game);
    }
    sendUpdateRoomState(db);
  } catch (error) {
    console.error(error);
  }
}
