import { Game } from 'models/Game';
import { Database } from '../models/Database';
import {
  WebSocketWithId,
  Command,
  RegResponseData,
  UpdateRoomStateResponseType,
  RoomUsers,
  Rooms,
  CreateGameResponseType,
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
    const res: UpdateRoomStateResponseType = {
      type: 'update_room',
      data: '',
      id: 0,
    };
    singleRooms.forEach(function (value) {
      const roomUsers: RoomUsers[] = [];
      const rooms: Rooms[] = [];
      for (let i = 0; i < value.players.length; i++) {
        roomUsers.push({
          name: value.players[i]?.name,
          index: value.players[i]?.index,
        });
      }
      rooms.push({ roomId: value.id, roomUsers: roomUsers });
      res.data = JSON.stringify(rooms);
    });
    // console.log('sendUpdateRoomState:', JSON.stringify(res));
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
  console.log(`sendCreateGame`);
  const res: CreateGameResponseType = {
    type: 'create_game',
    data: JSON.stringify({ idGame: game.idGame, idPlayer: game.idPlayer }),
    id: 0,
  };
  game.room.players.forEach(function (value) {
    value.ws.send(JSON.stringify(res));
  });
}

// Generate response for adding user to room
// export function generateCreateGameResponse(data) {
//   const response = {
//     type: 'create_game',
//     data,
//     id,
//   };
//   return JSON.stringify(response);
// }

// Generate response for updating room state

/*
// Generate response for updating winners
export function generateUpdateWinnersResponse(data) {
  const response = {
    type: 'update_winners',
    data,
    id,
  };
  return JSON.stringify(response);
}


// Generate response for attack
export function generateAttackResponse(data) {
  const response = {
    type: 'attack',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for changing player's turn
export function generateTurnResponse(data) {
  const response = {
    type: 'turn',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for finishing the game
export function generateFinishGameResponse(data) {
  const response = {
    type: 'finish',
    data,
    id,
  };
  return JSON.stringify(response);
}
*/
