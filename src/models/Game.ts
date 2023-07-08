import { Room } from './Room';
import { Ship } from './types';

export class Game {
  private _gameId: number;
  private _room: Room;
  private _ships = new Map<number, Ship[]>();

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

  // public getIdPlayer(currentId: number) {
  //   for (let i = 0; i < this._room.players.length; i++) {
  //     if (this._room.players[i]?.index !== currentId) {
  //       return this._room.players[i]?.index;
  //     }
  //   }
  //   return currentId;
  // }
}
