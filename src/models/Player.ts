import { WebSocketWithId } from '../models/types';

export class Player {
  private _ws: WebSocketWithId;
  private _index: number;
  private _name: string;
  private _password: string;
  private _wins: number;

  constructor(
    ws: WebSocketWithId,
    index: number,
    name: string,
    password: string,
  ) {
    this._ws = ws;
    this._index = index;
    this._name = name;
    this._password = password;
    this._wins = 0;
  }

  public get ws() {
    return this._ws;
  }

  public get index() {
    return this._index;
  }

  public get name() {
    return this._name;
  }

  public get password() {
    return this._password;
  }

  public addWins() {
    this._wins++;
  }

  public get wins() {
    return this._wins;
  }
}
