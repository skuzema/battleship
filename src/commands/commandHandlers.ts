import { RegRequestData } from '../models/types';
import { generateRegResponse } from './messageSender';
import { WebSocketWithId } from '../models/types';

export function handleRegistration(ws: WebSocketWithId, body: string) {
  try {
    console.log('ws.id:', ws.connectionId);
    console.log('body:', body);
    const user: RegRequestData = JSON.parse(body);
    generateRegResponse(ws, user);
    return user;
  } catch (error) {
    console.error('Error parsing command:', error);
    return null;
  }
}
