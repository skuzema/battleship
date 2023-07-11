import { WebSocketWithId, Command } from '../models/types';
import { Database } from '../models/Database';
import {
  handleRegistration,
  handleCreateRoom,
  handleAddUserToRoom,
  handleAddShips,
  handleAttack,
  handleRandomAttack,
  handleSinglePlay,
} from '../commands/commandHandlers';
import { sendUpdateWinners } from '../commands/messageSender';

export function handleCommands(
  ws: WebSocketWithId,
  db: Database,
  message: string,
) {
  try {
    const command: Command = JSON.parse(message);
    switch (command.type) {
      case 'reg':
        console.log(
          `<-- reg, player: ${ws.connectionId}, data: ${JSON.stringify(
            command,
          )}`,
        );
        handleRegistration(ws, db, command.data);
        sendUpdateWinners(db);
        break;
      case 'create_room':
        console.log(
          `<-- create_room, player: ${ws.connectionId}, data: ${JSON.stringify(
            command,
          )}`,
        );
        handleCreateRoom(ws, db);
        sendUpdateWinners(db);
        break;
      case 'add_user_to_room':
        console.log(
          `<-- add_user_to_room, player: ${
            ws.connectionId
          }, data: ${JSON.stringify(command)}`,
        );
        handleAddUserToRoom(ws, db, command.data);
        break;
      case 'add_ships':
        console.log(
          `<-- add_ships, player: ${ws.connectionId}, data: ${JSON.stringify(
            command,
          )}`,
        );
        handleAddShips(db, command.data);
        break;
      case 'attack':
        console.log(
          `<-- attack, player: ${ws.connectionId}, data: ${JSON.stringify(
            command,
          )}`,
        );
        handleAttack(db, command.data);
        break;
      case 'randomAttack':
        console.log(
          `<-- randomAttack, player: ${ws.connectionId}, data: ${JSON.stringify(
            command,
          )}`,
        );
        handleRandomAttack(db, command.data);
        break;
      case 'single_play':
        console.log(
          `<-- single_play, player: ${ws.connectionId}, data: ${JSON.stringify(
            command,
          )}`,
        );
        handleSinglePlay(ws, db);
        break;
      default:
    }
  } catch (error) {
    console.error('Error parsing command:', error);
  }
}
