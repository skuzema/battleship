import { WebSocketWithId, Command } from '../models/types';
import { Database } from '../models/Database';
import {
  handleRegistration,
  handleCreateRoom,
  handleAddUserToRoom,
  handleAddShips,
  handleAttack,
  handleRandomAttack,
} from '../commands/commandHandlers';
import { sendUpdateWinners } from '../commands/messageSender';

export function handleCommands(
  ws: WebSocketWithId,
  db: Database,
  message: string,
) {
  try {
    const command: Command = JSON.parse(message);
    console.log(
      `Command type: ${command.type}`,
      `command: ${JSON.stringify(command)}`,
    );
    switch (command.type) {
      case 'reg':
        handleRegistration(ws, db, command.data);
        sendUpdateWinners(db);
        break;
      case 'create_room':
        handleCreateRoom(ws, db);
        sendUpdateWinners(db);
        break;
      case 'add_user_to_room':
        handleAddUserToRoom(ws, db, command.data);
        break;
      case 'add_ships':
        handleAddShips(ws, db, command.data);
        break;
      case 'attack':
        handleAttack(db, command.data);
        break;
      case 'randomAttack':
        handleRandomAttack(db, command.data);
        break;
      default:
    }
  } catch (error) {
    console.error('Error parsing command:', error);
  }
}
