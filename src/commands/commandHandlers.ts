import { RegRequestData, RegResponseData } from '../models/types';
import { sendRegResponse } from './messageSender';
import { WebSocketWithId, Database } from '../models/types';

export function handleRegistration(ws: WebSocketWithId, db:Database, body: string) {
  try {
    console.log('ws.id:', ws.connectionId);
    console.log('body:', body);
    const req: RegRequestData = JSON.parse(body);
    const player: RegResponseData = db.createPlayer(ws, req.name, req.password);
    console.log(`handleRegistration, player: ${JSON.stringify(player)}`);
    sendRegResponse(ws, player);
    return;
  } catch (error) {
    console.error('Error parsing command:', error);
    return;
  }
}

// export function handleCreateRoom(ws: WebSocketWithId, db: Database) {
//   try {
//     console.log('handleCreateRoom, ws.id:', ws.connectionId);
//     generateUpdateRoomState(ws);
//     return;
//   } catch (error) {
//     console.error('Error parsing command:', error);
//     return null;
//   }
// }
