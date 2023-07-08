import WebSocket from 'ws';

export interface WebSocketWithId extends WebSocket {
  connectionId: number;
}

//  Request-response interfaces

interface BaseCommandType<T> {
  type: string;
  data: T;
  id: number;
}

export interface RegRequestData {
  name: string;
  password: string;
}

export interface RegResponseData {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface RoomUsers {
  name: string | undefined;
  index: number | undefined;
}

export interface Rooms {
  roomId: number;
  roomUsers: RoomUsers[];
}

export interface AddPlayerToRoomRequestData {
  indexRoom: number;
}

export interface CreateGameData {
  idGame: number;
  idPlayer: number;
}

export enum ShipType {
  small = 'small',
  medium = 'medium',
  large = 'large',
  huge = 'huge',
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
}

export interface AddShipsRequestData {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface StartGameResponseData {
  ships: Ship[];
  currentPlayerIndex: number;
}

export type Command = BaseCommandType<string>;
export type RegRequestType = BaseCommandType<RegRequestData>;
export type RegResponseType = BaseCommandType<RegResponseData>;
export type BaseResponseType = BaseCommandType<string>;

//  Class interfaces

export interface Player {
  ws: WebSocketWithId;
  index: number;
  name: string;
  password: string;
}

export interface Room {
  id: number;
  name: string;
  players: Player[];
}

// export interface Ship {
//   id: number;
//   type: string;
//   position: {
//     x: number;
//     y: number;
//   };
// }
