import { WebSocketWithId } from '../models/types';
import { CommandType, RegRequestData, RegResponseData } from '../models/types';

// Generate response for player registration/login
export function generateRegResponse(ws: WebSocketWithId, req: RegRequestData) {
  try {
    const responseData: RegResponseData = {
      name: req.name ?? 'anonymous',
      index: ws.connectionId,
      error: false,
      errorText: '',
    };
    const response: CommandType = {
      type: 'reg',
      data: JSON.stringify(responseData),
      id: 0,
    };
    ws.send(JSON.stringify(response));
  } catch (error: unknown) {
    console.error('Error parsing command:', error);
    return;
  }
}

/*
// Generate response for updating winners
export function generateUpdateWinnersResponse(data) {
  const response = {
    type: 'update_winners',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for adding user to room
export function generateCreateGameResponse(data) {
  const response = {
    type: 'create_game',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for updating room state
export function generateUpdateRoomResponse(data) {
  const response = {
    type: 'update_room',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for starting the game
export function generateStartGameResponse(data) {
  const response = {
    type: 'start_game',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for attack
export function generateAttackResponse(data) {
  const response = {
    type: 'attack',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for changing player's turn
export function generateTurnResponse(data) {
  const response = {
    type: 'turn',
    data,
    id,
  };
  return JSON.stringify(response);
}

// Generate response for finishing the game
export function generateFinishGameResponse(data) {
  const response = {
    type: 'finish',
    data,
    id,
  };
  return JSON.stringify(response);
}
*/
