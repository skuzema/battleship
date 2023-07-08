import { Player } from '../models/types';

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
}
