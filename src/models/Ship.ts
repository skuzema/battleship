import { ShipType } from '../models/types';

export class Ship {
  private _position: { x: number; y: number };
  private _direction: boolean;
  private _length: number;
  private _type: ShipType;

  constructor(
    position: { x: number; y: number },
    direction: boolean,
    length: number,
    type: ShipType,
  ) {
    this._position = position;
    this._direction = direction;
    this._length = length;
    this._type = type;
  }

  public get position(): { x: number; y: number } {
    return this._position;
  }

  public get direction() {
    return this._direction;
  }

  public get length() {
    return this._length;
  }

  public get type() {
    return this._type;
  }
}
