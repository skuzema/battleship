import { Room } from './Room';

export class Game {
  private _gameId: number;
  private _room: Room;
  private _turn: number;

  constructor(gameId: number, room: Room) {
    this._gameId = gameId;
    this._room = room;
    this._turn = room.players[0]?.index ?? 0;
  }

  public get idGame() {
    return this._gameId;
  }

  public get room() {
    return this._room;
  }

  public get idPlayer() {
    return this._turn;
  }
}
