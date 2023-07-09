import { CellStatus, Ship } from './types';

export class Field {
  private _field: CellStatus[][];

  constructor(ships: Ship[]) {
    this._field = this.fillBattleField(ships);
  }

  private initBattleField(): CellStatus[][] {
    return Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => CellStatus.Empty),
    );
  }

  private placeShip(field: CellStatus[][], ship: Ship) {
    const { position, direction, length } = ship;
    const { x, y } = position;

    if (direction) {
      for (let i = y; i < y + length; i++) {
        field[i][x] = CellStatus.Ship;
      }
    } else {
      for (let i = x; i < x + length; i++) {
        field[y][i] = CellStatus.Ship;
      }
    }
  }

  public fillBattleField(ships: Ship[]): CellStatus[][] {
    const field: CellStatus[][] = this.initBattleField();
    ships.forEach((ship) => {
      this.placeShip(field, ship);
    });
    console.log('BattleField');
    console.table(field);
    return field;
  }

  public get field() {
    return this._field;
  }
}
