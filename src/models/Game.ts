import { Room } from './Room';
import { Field } from './Field';
import {
  Ship,
  AttackRequestData,
  CellStatus,
  AttackResponseData,
} from './types';

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

  private getFields(playerId: number): Field | undefined {
    return this._fields.get(playerId);
  }

  public getEnemyPlayerId(playerId: number): number | undefined {
    const playerIds = this._room.players.map((player) => player.index);
    const enemyPlayerId = playerIds.find((id) => id !== playerId);
    return enemyPlayerId;
  }

  public attack(attackObj: AttackRequestData): AttackResponseData | undefined{
    const { x, y, indexPlayer } = attackObj;
    console.log(`attack x: ${x}, y: ${y}, indexPlayer: ${indexPlayer}`);

    const currentPlayerField = this.getFields(indexPlayer);
    const enemyPlayerId = this.getEnemyPlayerId(indexPlayer);

    if (currentPlayerField !== undefined && enemyPlayerId !== undefined) {
      const enemyPlayerField = this.getFields(enemyPlayerId);

      if (enemyPlayerField !== undefined) {
        const targetCellStatus = enemyPlayerField.field[y][x];

        if (targetCellStatus === CellStatus.Empty) {
          enemyPlayerField.field[y][x] = CellStatus.Miss;
          currentPlayerField.field[y][x] = CellStatus.Miss;
          return this.createAttackResponseData(x, y, indexPlayer, CellStatus.Miss);
        } else if (targetCellStatus === CellStatus.Ship) {
          enemyPlayerField.field[y][x] = CellStatus.Shot;
          currentPlayerField.field[y][x] = CellStatus.Shot;

          const ship = this.findShipByPosition(this.getShips(enemyPlayerId), {
            x,
            y,
          });

          if (ship !== undefined) {
            const shipCells = this.getShipCells(ship);
            const shipShotCells = shipCells.filter(
              (cell) =>
                enemyPlayerField.field[cell.y][cell.x] === CellStatus.Shot,
            );

            if (shipShotCells.length === ship.length) {
              this.markSurroundingCells(
                enemyPlayerField.field,
                shipCells,
                CellStatus.Miss,
              );
              this.markSurroundingCells(
                currentPlayerField.field,
                shipCells,
                CellStatus.Miss,
              );
              return this.createAttackResponseData(
                x,
                y,
                indexPlayer,
                CellStatus.Killed,
              );
            } else {
              return this.createAttackResponseData(
                x,
                y,
                indexPlayer,
                CellStatus.Shot,
              );
            }
          }
        }
      }
    }
  }

  private getShipCells(ship: Ship): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    const { x, y } = ship.position;

    if (ship.direction) {
      for (let i = y; i < y + ship.length; i++) {
        cells.push({ x, y: i });
      }
    } else {
      for (let i = x; i < x + ship.length; i++) {
        cells.push({ x: i, y });
      }
    }

    return cells;
  }

  private findShipByPosition(
    ships: Ship[],
    position: { x: number; y: number },
  ): Ship | undefined {
    return ships.find((ship) => {
      const { x, y } = position;
      if (ship.direction) {
        return (
          x === ship.position.y &&
          y >= ship.position.x &&
          y < ship.position.x + ship.length
        );
      } else {
        return (
          x >= ship.position.x &&
          x < ship.position.x + ship.length &&
          y === ship.position.y
        );
      }
    });
  }

  private markSurroundingCells(
    field: CellStatus[][],
    shipCells: { x: number; y: number }[],
    status: CellStatus,
  ) {
    shipCells.forEach((cell) => {
      const { x, y } = cell;
      this.markCell(field, x - 1, y - 1, status);
      this.markCell(field, x, y - 1, status);
      this.markCell(field, x + 1, y - 1, status);
      this.markCell(field, x - 1, y, status);
      this.markCell(field, x + 1, y, status);
      this.markCell(field, x - 1, y + 1, status);
      this.markCell(field, x, y + 1, status);
      this.markCell(field, x + 1, y + 1, status);
    });
  }

  private markCell(
    field: CellStatus[][],
    x: number,
    y: number,
    status: CellStatus,
  ) {
    if (x >= 0 && x < field.length && y >= 0 && y < field.length) {
      field[y][x] = status;
    }
  }

  private createAttackResponseData(
    x: number,
    y: number,
    currentPlayer: number,
    status: CellStatus,
  ): AttackResponseData {
    return {
      position: {
        x,
        y,
      },
      currentPlayer,
      status,
    };
  }
}
