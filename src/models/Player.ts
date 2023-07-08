import { WebSocketWithId } from '../models/types';

export class Player {
  private _ws: WebSocketWithId;
  private _index: number;
  private _name: string;
  private _password: string;

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
}
