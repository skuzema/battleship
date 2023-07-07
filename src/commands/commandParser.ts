import { WebSocketWithId } from '../models/types';
import { CommandType } from '../models/types';
import { handleRegistration } from '../commands/commandHandlers';

export function handleCommands(ws: WebSocketWithId, message: string) {
  try {
    const command: CommandType = JSON.parse(message);
    console.log(JSON.stringify(command), command.type);
    switch (command.type) {
      case 'reg':
        handleRegistration(ws, command.data);
        break;
      case 'create_room':
        // handleCreateRoom();
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
