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

export interface TurnData {
  currentPlayer: number;
}

export enum CellStatus {
  Empty,
  Miss,
  Shot,
  Small,
  Medium,
  Large,
  Huge,
}

export enum AttackStatus {
  Shot = 'shot',
  Miss = 'miss',
  Killed = 'killed',
}

export interface AttackRequestData {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
}

export interface AttackResponseData {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: AttackStatus;
}

export interface RandomAttackRequestData {
  gameId: number;
  indexPlayer: number;
}

export interface FinishGameResponseData {
  winPlayer: number;
}

export interface Winners {
  name: string;
  wins: number;
}

export type Command = BaseCommandType<string>;
export type RegRequestType = BaseCommandType<RegRequestData>;
export type RegResponseType = BaseCommandType<RegResponseData>;
export type BaseResponseType = BaseCommandType<string>;
