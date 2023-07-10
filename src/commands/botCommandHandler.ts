import { Bot } from 'models/Bot';
import {
  Command,
  CreateGameData,
  RegResponseData,
  Rooms,
  Ship,
} from 'models/types';
import WebSocket from 'ws';
import { sendUpdateRoomState, sendCreateGame } from './messageSender';
import { randomShips } from './botShipGenerator';
import { Game } from 'models/Game';

export function sendCreateRoom(ws: WebSocket, bot: Bot, body: string) {
  try {
    console.log(`---Bot sendCreateRoom 1, ws: ${ws}, Bot:${bot}, body:${body}`);
    const player: RegResponseData = JSON.parse(body);
    if (!player.error && player.index > 0) {
      bot.setId(player.index);
      const reqCreateRoom: Command = {
        type: 'create_room',
        data: '',
        id: 0,
      };
      console.log(
        `---Bot sendCreateRoom 2, player index: ${player.index}, playerId:${bot.playerWithId}, id:${bot.id}`,
      );
      ws.send(JSON.stringify(reqCreateRoom));
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

export function sendAddPlayerToRoom(bot: Bot, body: string) {
  try {
    // console.log(
    //   `---Bot sendAddPlayerToRoom 1, ws: ${ws}, Bot:${bot}, body:${body}`,
    // );
    const rooms: Rooms[] = JSON.parse(body);
    console.log(
      `---Bot sendAddPlayerToRoom 2, rooms :${JSON.stringify(rooms)}`,
    );
    if (rooms) {
      let targetRoom: Rooms = {
        roomId: 0,
        roomUsers: [],
      };
      rooms.forEach((room) => {
        room.roomUsers.forEach((user) => {
          if (user.index === bot.id) {
            targetRoom = room;
          }
        });
      });
      console.log(
        `---Bot sendAddPlayerToRoom 3, targetRoom: ${JSON.stringify(
          targetRoom,
        )}`,
      );
      if (targetRoom) {
        console.log(
          `---Bot sendAddPlayerToRoom 4, targetRoom.roomId :${targetRoom.roomId}`,
        );
        if (targetRoom.roomId) {
          console.log(
            `---Bot sendAddPlayerToRoom 5, targetRoom.roomId: ${targetRoom.roomId}, add user:${bot.playerWithId}`,
          );
          const game: Game | null = bot.db.addPlayerToRoom(
            targetRoom.roomId,
            bot.playerWithId,
          );
          if (game) {
            sendCreateGame(game);
          }
          sendUpdateRoomState(bot.db);
        }
      }
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

export function sendAddShips(ws: WebSocket, bot: Bot, body: string) {
  try {
    const game: CreateGameData = JSON.parse(body);
    console.log(`---Bot sendAddShips 1, game:${JSON.stringify(game)}`);
    if (game.idGame && game.idPlayer === bot.id) {
      bot.setGameId(game.idGame);
      const addShipsData: Ship[] = randomShips();
      console.log(
        `---Bot sendAddShips 2, addShipsData: ${JSON.stringify(addShipsData)}`,
      );
      const addShipsRequest: Command = {
        type: 'add_ships',
        data: JSON.stringify({
          gameId: bot.gameId,
          ships: addShipsData,
          indexPlayer: bot.id,
        }),
        id: 0,
      };

      ws.send(JSON.stringify(addShipsRequest));
    }
  } catch (error: unknown) {
    console.error(error);
  }
}
