import { Game } from 'models/Game';
import { Database } from '../models/Database';
import {
  WebSocketWithId,
  Command,
  RegResponseData,
  RoomUsers,
  Rooms,
  BaseResponseType,
  AttackResponseData,
} from '../models/types';

export function sendRegResponse(ws: WebSocketWithId, res: RegResponseData) {
  try {
    const response: Command = {
      type: 'reg',
      data: JSON.stringify(res),
      id: 0,
    };
    ws.send(JSON.stringify(response));
  } catch (error: unknown) {
    console.error(error);
  }
}

export function sendUpdateRoomState(db: Database) {
  try {
    console.log('Handle sendUpdateRoomState');
    const singleRooms = db.getRoomsWithSinglePlayer();
    const players = db.getPlayers();
    const res: BaseResponseType = {
      type: 'update_room',
      data: '',
      id: 0,
    };
    const rooms: Rooms[] = [];
    singleRooms.forEach(function (value) {
      console.log(`singleRooms: ${value.id}, ${value.name}`);
      const roomUsers: RoomUsers[] = [];

      for (let i = 0; i < value.players.length; i++) {
        roomUsers.push({
          name: value.players[i]?.name,
          index: value.players[i]?.index,
        });
      }
      rooms.push({ roomId: value.id, roomUsers: roomUsers });
    });
    res.data = JSON.stringify(rooms);
    console.log('sendUpdateRoomState:', JSON.stringify(res));
    players.forEach(function (value) {
      console.log(
        `Send Update Room State for ${value.ws.connectionId}: ${JSON.stringify(
          res,
        )}`,
      );
      value.ws.send(JSON.stringify(res));
    });
  } catch (error: unknown) {
    console.error(error);
    return;
  }
}

export function sendCreateGame(game: Game) {
  // console.log(`sendCreateGame Game: ${JSON.stringify(game)}`);
  console.log(`sendCreateGame ${JSON.stringify(game.id)}`);
  const res: BaseResponseType = {
    type: 'create_game',
    data: '',
    id: 0,
  };
  game.room.players.forEach(function (value) {
    res.data = JSON.stringify({
      idGame: game.id,
      idPlayer: value.index,
    });
    console.log(
      `sendCreateGame id: ${value.index}, data: ${JSON.stringify(res)}`,
    );
    value.ws.send(JSON.stringify(res));
  });
}

export function sendStartGame(game: Game) {
  console.log(`sendStartGame : ${game.id}`);
  const res: BaseResponseType = {
    type: 'start_game',
    data: '',
    id: 0,
  };
  game.room.players.forEach(function (value) {
    res.data = JSON.stringify({
      ships: game.getShips(value.index),
      currentPlayerIndex: value.index,
    });
    // console.log(
    //   `sendStartGame id: ${value.index}, data: ${JSON.stringify(res)}`,
    // );
    value.ws.send(JSON.stringify(res));
  });
  sendTurn(game);
}

export function sendTurn(game: Game) {
  console.log(`sendTurn playerId: ${game.turn}`);
  const res: BaseResponseType = {
    type: 'turn',
    data: JSON.stringify({
      currentPlayer: game.turn,
    }),
    id: 0,
  };
  game.room.players.forEach(function (value) {
    // console.log(
    //   `sendStartGame id: ${value.index}, data: ${JSON.stringify(res)}`,
    // );
    value.ws.send(JSON.stringify(res));
  });
}

export function sendAttackResponse(
  db: Database,
  game: Game,
  attackResponse: AttackResponseData | undefined,
) {
  if (attackResponse) {
    const res: BaseResponseType = {
      type: 'attack',
      data: JSON.stringify({
        ...attackResponse,
      }),
      id: 0,
    };
    let finishGame = false;
    game.room.players.forEach(function (value) {
      // console.log(
      //   `sendAttackResponse socket: ${
      //     value.ws.connectionId
      //   }, data: ${JSON.stringify(res)}`,
      // );
      value.ws.send(JSON.stringify(res));
      if (game.finishGame(value.index)) {
        finishGame = true;
        sendFinishGame(game, value.index);
      }
    });
    if (finishGame) {
      const room = db.findUserInRoom(game.turn);
      sendUpdateWinners(db);
      if (room) {
        db.deleteRoom(room.id);
      }
      db.deleteGame(game.id);
      return;
    }
    sendTurn(game);
  }
}

export function sendMissAroundShip(
  game: Game,
  attackResponse: AttackResponseData | undefined,
) {
  if (attackResponse) {
    const res: BaseResponseType = {
      type: 'attack',
      data: JSON.stringify({
        ...attackResponse,
      }),
      id: 0,
    };
    game.room.players.forEach(function (value) {
      // console.log(
      //   `sendMissAroundShip socket: ${
      //     value.ws.connectionId
      //   }, data: ${JSON.stringify(res)}`,
      // );
      value.ws.send(JSON.stringify(res));
    });
    sendTurn(game);
  }
}

export function sendFinishGame(game: Game, playerId: number) {
  console.log(`sendFinishGame playerId: ${playerId}`);
  const res: BaseResponseType = {
    type: 'finish',
    data: JSON.stringify({
      winPlayer: playerId,
    }),
    id: 0,
  };
  game.room.players.forEach(function (value) {
    console.log(
      `sendFinishGame socket: ${value.ws.connectionId}, data: ${JSON.stringify(
        res,
      )}`,
    );
    value.ws.send(JSON.stringify(res));
  });
}

export function sendUpdateWinners(db: Database) {
  console.log(`sendUpdateWinners`);
  const res: BaseResponseType = {
    type: 'update_winners',
    data: JSON.stringify(db.getWinners()),
    id: 0,
  };
  const players = db.getPlayers();
  players.forEach(function (value) {
    console.log(
      `sendUpdateWinners ${value.ws.connectionId}: ${JSON.stringify(res)}`,
    );
    value.ws.send(JSON.stringify(res));
  });
}
