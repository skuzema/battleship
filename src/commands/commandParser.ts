import { WebSocketWithId, Database } from '../models/types';
import { Command } from '../models/types';
import {
  handleRegistration
} from '../commands/commandHandlers';

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
        break;
      case 'create_room':
        // handleCreateRoom(ws, db);
        break;
      case 'add_user_to_room':
        // handleAddUserToRoom(command.data);
        break;
      case 'add_ships':
        // handleAddShips(ws, command.data);
        break;
      case 'attack':
        // handleAttack(ws, command.data);
        break;
      case 'randomAttack':
        // handleRandomAttack(ws, command.data);
        break;
      default:
    }
  } catch (error) {
    console.error('Error parsing command:', error);
    return null;
  }
}
