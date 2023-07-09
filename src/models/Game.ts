import { Room } from './Room';
import { Field } from './Field';
import { Ship } from './types';

export class Game {
  private _gameId: number;
  private _room: Room;
  private _turn: number;
  private _ships = new Map<number, Ship[]>();
  private _fields = new Map<number, Field>();

  constructor(gameId: number, room: Room) {
    this._gameId = gameId;
    this._room = room;
  }

  public get idGame() {
    return this._gameId;
  }

  public get room() {
    return this._room;
  }

  public get turn() {
    return this._turn;
  }

  public getShips(playerId: number): Ship[] {
    const ships: Ship[] = [];
    this._ships.get(playerId)?.forEach(function (value) {
      ships.push({
        position: value.position,
        direction: value.direction,
        length: value.length,
        type: value.type,
      });
    });
    return ships;
  }

  public addShips(playerId: number, ships: Ship[]): Map<number, Ship[]> {
    this._ships.set(playerId, ships);
    return this._ships;
  }

  public addFields(playerId: number, ships: Ship[]): Map<number, Field> {
    const field = new Field(ships);
    this._fields.set(playerId, field);
    return this._fields;
  }
}
