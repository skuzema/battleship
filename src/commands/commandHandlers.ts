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
    console.log(`AddUserToRoom: ws.id:${ws.connectionId}, body:${body}`);
    const req: AddPlayerToRoomRequestData = JSON.parse(body);
    const game: Game | null = db.addPlayerToRoom(
      req.indexRoom,
      ws.connectionId,
    );
    console.log(`AddUserToRoom: game:${game}, gameId:${game?.id}`);
    if (game) {
      sendCreateGame(game);
    }
    sendUpdateRoomState(db);
  } catch (error) {
    console.error(error);
  }
}

export function handleAddShips(
  ws: WebSocketWithId,
  db: Database,
  body: string,
) {
  try {
    console.log(`handleAddShips: ws.id:${ws.connectionId}, body:${body}`);
    const req: AddShipsRequestData = JSON.parse(body);
    console.log(`handleAddShips: 2 gameId:${req.gameId}`);
    const game = db.getGameById(req.gameId);
    console.log(`handleAddShips: 3 game:${game}`);
    const ships: Map<number, Ship[]> | undefined = game?.addShips(
      req.indexPlayer,
      req.ships,
    );
    const fields: Map<number, Field> | undefined = game?.addFields(
      req.indexPlayer,
      req.ships,
    );
    console.log(
      `handleAddShips 4: game:${game}, ships?.size === 2:${
        ships?.size === 2
      },fields?.size === 2: ${fields?.size === 2}`,
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
    // console.log(`handleAttack: ws.id:${ws.connectionId}, body:${body}`);
    const req: AttackRequestData = JSON.parse(body);
    const game = db.getGameById(req.gameId);
    if (!game || (game && game.turn !== req.indexPlayer)) {
      return;
    }
    // console.log(`handleAttack: gameId:${game?.idGame}`);
    const res: AttackResponseData | undefined = game?.attack(req);
    // console.log(`handleAttack: response:${JSON.stringify(res)}`);
    if (res && game) {
      sendAttackResponse(db, game, res);
    }
  } catch (error) {
    console.error(error);
  }
}

export function handleRandomAttack(db: Database, body: string) {
  try {
    console.log(`handleRandomAttack: body:${body}`);
    const req: RandomAttackRequestData = JSON.parse(body);
    const game = db.getGameById(req.gameId);
    if (!game || (game && game.turn !== req.indexPlayer)) {
      return;
    }
    // console.log(`handleAttack: gameId:${game?.idGame}`);
    const res: AttackResponseData | undefined = game?.randomAttack(req);
    // console.log(`handleAttack: response:${JSON.stringify(res)}`);
    if (res && game) {
      sendAttackResponse(db, game, res);
    }
  } catch (error) {
    console.error(error);
  }
}

export function handleSinglePlay(
  ws: WebSocketWithId,
  db: Database,
  body: string,
) {
  try {
    console.log(
      `handleSinglePlay: body:${body} db:${db}, ws:${ws.connectionId}`,
    );
    db.createBot(db, ws.connectionId);
  } catch (error) {
    console.error(error);
  }
}
