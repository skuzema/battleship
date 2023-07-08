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

export type Command = BaseCommandType<string>;
export type RegRequestType = BaseCommandType<RegRequestData>;
export type RegResponseType = BaseCommandType<RegResponseData>;

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

export interface Ship {
  id: number;
  type: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Game {
  id: number;
  players: Player[];
  ships: Ship[];
}

export interface Database {
  createPlayer(
    ws: WebSocketWithId,
    name: string,
    password: string,
  ): RegResponseData;
  createRoom(name: string): Room;
  getRoom(id: number): Room | undefined;
  createShip(type: string, position: { x: number; y: number }): Ship;
  getShip(id: number): Ship | undefined;
  createGame(players: Player[], ships: Ship[]): Game;
  getGame(id: number): Game | undefined;
}
