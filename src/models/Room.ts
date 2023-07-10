import { Player } from '../models/Player';

export class Room {
  private _roomId: number;
  private _roomName: string;
  private _roomPlayers: Player[];

  constructor(roomId: number, player: Player | undefined) {
    this._roomId = roomId;
    this._roomName = `Room N${roomId.toString()}`;
    this._roomPlayers = [];
    if (player) {
      this._roomPlayers.push(player);
    }
  }

  public get id() {
    return this._roomId;
  }

  public get name() {
    return this._roomName;
  }

  public get players() {
    return this._roomPlayers;
  }

  public removePlayers() {
    console.log(`removePlayers`);
    return (this._roomPlayers = []);
  }

  public removePlayerById(playerId: number): boolean {
    console.log(`removePlayerById 1`);
    const index = this._roomPlayers.findIndex((o) => o.index === playerId);
    console.log(`removePlayerById 2 index:${index}`);
    if (index > -1) {
      console.log(
        `removePlayerById 3 size before: ${this._roomPlayers.length}`,
      );
      this._roomPlayers.splice(index, 1);
      console.log(`removePlayerById 4 size after: ${this._roomPlayers.length}`);
      return true;
    }
    return false;
  }

  public addPlayerToRoom(player: Player): number {
    if (this._roomPlayers.find((o) => o.index !== player.index)) {
      this._roomPlayers.push(player);
    }
    return this._roomPlayers.length;
  }
}
