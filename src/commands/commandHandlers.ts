import {
  WebSocketWithId,
  RegRequestData,
  RegResponseData,
  AddPlayerToRoomRequestData,
  AddShipsRequestData,
  Ship,
  AttackRequestData,
  AttackResponseData,
  RandomAttackRequestData,
} from '../models/types';
import {
  sendRegResponse,
  sendUpdateRoomState,
  sendCreateGame,
  sendStartGame,
  sendAttackResponse,
} from './messageSender';
import { Database } from '../models/Database';
import { Game } from 'models/Game';
import { Field } from 'models/Field';

export function handleRegistration(
  ws: WebSocketWithId,
  db: Database,
  body: string,
) {
  try {
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

export function handleAddShips(db: Database, body: string) {
  try {
    const req: AddShipsRequestData = JSON.parse(body);
    const game = db.getGameById(req.gameId);
    const ships: Map<number, Ship[]> | undefined = game?.addShips(
      req.indexPlayer,
      req.ships,
    );
    const fields: Map<number, Field> | undefined = game?.addFields(
      req.indexPlayer,
      req.ships,
    );
    if (game && ships?.size === 2 && fields?.size === 2) {
      sendStartGame(game);
    }
  } catch (error) {
    console.error(error);
  }
}

export function handleAttack(db: Database, body: string) {
  try {
    const req: AttackRequestData = JSON.parse(body);
    const game = db.getGameById(req.gameId);
    if (!game || (game && game.turn !== req.indexPlayer)) {
      return;
    }
    const res: AttackResponseData | undefined = game?.attack(req);
    if (res && game) {
      sendAttackResponse(db, game, res);
    }
  } catch (error) {
    console.error(error);
  }
}

export function handleRandomAttack(db: Database, body: string) {
  try {
    const req: RandomAttackRequestData = JSON.parse(body);
    const game = db.getGameById(req.gameId);
    if (!game || (game && game.turn !== req.indexPlayer)) {
      return;
    }
    const res: AttackResponseData | undefined = game?.randomAttack(req);
    if (res && game) {
      sendAttackResponse(db, game, res);
    }
  } catch (error) {
    console.error(error);
  }
}

export function handleSinglePlay(ws: WebSocketWithId, db: Database) {
  try {
    db.createBot(db, ws.connectionId);
  } catch (error) {
    console.error(error);
  }
}
