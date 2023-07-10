import { WebSocket, createWebSocketStream } from 'ws';
import dotenv from 'dotenv';
import { Database } from './Database';
import { handleCommands } from '../commands/botCommandParser';

export class Bot {
  private _ws: WebSocket;
  private _id: number;
  private _gameId: number;
  private _db: Database;
  private _playerWithId: number;
  private _name: string;
  private _password: string;

  constructor(db: Database, playerWithId: number) {
    this._db = db;
    this._id = 0;
    this._gameId = 0;
    this._playerWithId = playerWithId;
    this._name = `PlayerBot_${playerWithId}`;
    this._password = `BotPwd${playerWithId}`;
  }

  public get name() {
    return this._name;
  }

  public get password() {
    return this._password;
  }

  public get id() {
    return this._id;
  }

  public setId(id: number) {
    this._id = id;
  }

  public get gameId() {
    return this._gameId;
  }

  public setGameId(id: number) {
    this._gameId = id;
  }

  public get db() {
    return this._db;
  }

  public get ws() {
    return this._ws;
  }

  public get playerWithId() {
    return this._playerWithId;
  }

  public initBot() {
    console.log(`Init Bot`);
    dotenv.config();
    const WS_PORT = process.env.WS_PORT || '3000';
    const WS_URL = process.env.WS_URL || 'ws://localhost';

    const wss = new WebSocket(`${WS_URL}:${WS_PORT}`);
    this._ws = wss;

    wss.on('open', () => {
      console.log(`\nBot connection`);
      wss.send(
        JSON.stringify({
          type: 'reg',
          data: JSON.stringify({
            name: this._name,
            password: this._password,
          }),
          id: 0,
        }),
      );
      const duplex = createWebSocketStream(wss, {
        decodeStrings: false,
        encoding: 'utf-8',
      });

      duplex.on('data', (command: string) => {
        try {
          console.log(`\nBot command received: ${command}`);
          handleCommands(wss, this, command);
        } catch (error: unknown) {
          console.error(error);
        }
      });

      wss.on('close', () => {
        console.log(`Bot ${this._id} has been disconnected from server.`);
      });
    });
  }
}
