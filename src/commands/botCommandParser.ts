import { Command } from '../models/types';
import WebSocket from 'ws';
import {
  sendCreateRoom,
  sendAddPlayerToRoom,
} from '../commands/botCommandHandler';
import { Bot } from 'models/Bot';

export function handleCommands(ws: WebSocket, bot: Bot, message: string) {
  try {
    const command: Command = JSON.parse(message);
    console.log(
      `Bot command type: ${command.type}`,
      `command: ${JSON.stringify(command)}, ws:${ws}, bot:${bot} `,
    );
    switch (command.type) {
      case 'reg':
        sendCreateRoom(ws, bot, command.data);
        break;
      case 'update_room':
        sendAddPlayerToRoom(ws, bot, command.data);
        break;
      case 'add_user_to_room':
        // handleAddUserToRoom(ws, db, command.data);
        break;
      case 'add_ships':
        // handleAddShips(ws, db, command.data);
        break;
      case 'attack':
        // handleAttack(db, command.data);
        break;
      case 'randomAttack':
        // handleRandomAttack(db, command.data);
        break;
      case 'single_play':
        // handleSinglePlay(ws, db, command.data);
        break;
      default:
    }
  } catch (error) {
    console.error('Error parsing command:', error);
  }
}
