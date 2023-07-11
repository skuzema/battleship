import { Command } from '../models/types';
import WebSocket from 'ws';
import {
  sendCreateRoom,
  sendAddPlayerToRoom,
  sendAddShips,
  sendStartGame as handleStartGame,
  handleTurn,
  handleFinish,
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
        sendAddPlayerToRoom(bot, command.data);
        break;
      case 'create_game':
        sendAddShips(ws, bot, command.data);
        break;
      case 'start_game':
        handleStartGame(bot);
        break;
      case 'turn':
        handleTurn(ws, bot, command.data);
        break;
      case 'finish':
        handleFinish(bot);
        break;
      default:
    }
  } catch (error) {
    console.error('Error parsing command:', error);
  }
}
