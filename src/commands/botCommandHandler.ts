import { Bot } from 'models/Bot';
import { Command, RegResponseData, Rooms, RoomUsers } from 'models/types';
import WebSocket from 'ws';
import { sendUpdateRoomState } from './messageSender';
import { Room } from 'models/Room';

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

export function sendAddPlayerToRoom(ws: WebSocket, bot: Bot, body: string) {
  try {
    console.log(
      `---Bot sendAddPlayerToRoom 1, ws: ${ws}, Bot:${bot}, body:${body}`,
    );
    const rooms: Rooms[] = JSON.parse(body);
    console.log(
      `---Bot sendAddPlayerToRoom 1a, createRoom: ${JSON.stringify(
        rooms,
      )}, createRoom.roomId :${JSON.stringify(rooms)}`,
    );
    if (rooms) {
      rooms.forEach((room)=>{
        console
      })
      const roomUser: RoomUsers[] = JSON.parse(body);
      const room = roomUser.find((o) => o.index === bot.id);
      if (room) {
        console.log(
          `---Bot sendAddPlayerToRoom 2, ws: ${ws}, Bot:${bot}, body:${body}`,
        );
        if (room.index) {
          console.log(
            `---Bot sendAddPlayerToRoom 3, room.index: ${room.index}, add user:${bot.playerWithId}`,
          );
          bot.db.addPlayerToRoom(room.index, bot.playerWithId);
          sendUpdateRoomState(bot.db);
        }
      }
    }
  } catch (error: unknown) {
    console.error(error);
  }
}
