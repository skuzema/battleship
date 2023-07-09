import { Room } from './Room';
import { Field } from './Field';
import {
  Ship,
  AttackRequestData,
  CellStatus,
  AttackStatus,
  AttackResponseData,
} from './types';
import { sendAttackResponse } from '../commands/messageSender';

export class Game {
  private _gameId: number;
  private _room: Room;
  private _turn: number;
  private _ships = new Map<number, Ship[]>();
  private _fields = new Map<number, Field>();

  constructor(gameId: number, room: Room) {
    this._gameId = gameId;
    this._room = room;
    this._turn = room.players[0].index;
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

  public attack(attackObj: AttackRequestData): AttackResponseData | undefined {
    const { x, y, indexPlayer } = attackObj;
    console.log(`attack x: ${x}, y: ${y}, indexPlayer: ${indexPlayer}`);

    const enemyPlayerId = this.getEnemyPlayerId(indexPlayer);

    if (enemyPlayerId !== undefined) {
      const enemyPlayerField = this.getFields(enemyPlayerId);
      if (enemyPlayerField !== undefined) {
        const targetCellStatus = enemyPlayerField.field[y][x];

        if (
          targetCellStatus === CellStatus.Empty ||
          targetCellStatus === CellStatus.Miss
        ) {
          enemyPlayerField.field[y][x] = CellStatus.Miss;
          this._turn = enemyPlayerId;
          return this.createAttackResponseData(
            x,
            y,
            indexPlayer,
            AttackStatus.Miss,
          );
        } else {
          enemyPlayerField.field[y][x] = CellStatus.Shot;
          const ship = this.getShipByCell(enemyPlayerId, { x, y });
          const attackResult: AttackStatus = this.isShipKilled(
            enemyPlayerField,
            ship,
          )
            ? AttackStatus.Killed
            : AttackStatus.Shot;
          console.log(
            `1. markSurroundingCells attackResult === AttackStatus.Killed ${
              attackResult === AttackStatus.Killed
            }`,
          );
          if (attackResult === AttackStatus.Killed) {
            console.log(`2. ship !== undefined ${ship !== undefined}`);
            if (ship !== undefined) {
              const shipCells = this.getShipCells(ship);
              this.markSurroundingCells(
                enemyPlayerField.field,
                shipCells,
                CellStatus.Miss,
                indexPlayer,
              );
            }
          }
          this._turn = indexPlayer;
          return this.createAttackResponseData(x, y, indexPlayer, attackResult);
        }
      }
    }
  }

  private isShipKilled(playerField: Field, ship: Ship | undefined): boolean {
    if (playerField !== undefined && ship !== undefined) {
      const shipCells = this.getShipCells(ship);
      const shipShotCells = shipCells.filter(
        (cell) => playerField.field[cell.y][cell.x] === CellStatus.Shot,
      );

      return shipShotCells.length === shipCells.length;
    }
    return false;
  }

  private getShipByCell(
    playerId: number,
    cell: { x: number; y: number },
  ): Ship | undefined {
    const currentPlayerField = this.getFields(playerId);

    if (currentPlayerField !== undefined) {
      const ships = this.getShips(playerId);

      for (const ship of ships) {
        const shipCells = this.getShipCells(ship);
        if (
          shipCells.some(
            (shipCell: { x: number; y: number }) =>
              shipCell.x === cell.x && shipCell.y === cell.y,
          )
        ) {
          return ship;
        }
      }
    }
    return undefined;
  }

  private getShipCells(ship: Ship): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    const { position, direction, length } = ship;
    const { x, y } = position;

    if (direction) {
      for (let i = y; i < y + length; i++) {
        cells.push({ x, y: i });
      }
    } else {
      for (let i = x; i < x + length; i++) {
        cells.push({ x: i, y });
      }
    }
    return cells;
  }

  private markSurroundingCells(
    field: CellStatus[][],
    shipCells: { x: number; y: number }[],
    status: CellStatus,
    indexPlayer: number,
  ) {
    shipCells.forEach((cell) => {
      const { x, y } = cell;
      this.markCell(field, x - 1, y - 1, status, indexPlayer);
      this.markCell(field, x, y - 1, status, indexPlayer);
      this.markCell(field, x + 1, y - 1, status, indexPlayer);
      this.markCell(field, x - 1, y, status, indexPlayer);
      this.markCell(field, x + 1, y, status, indexPlayer);
      this.markCell(field, x - 1, y + 1, status, indexPlayer);
      this.markCell(field, x, y + 1, status, indexPlayer);
      this.markCell(field, x + 1, y + 1, status, indexPlayer);
    });
  }

  private markCell(
    field: CellStatus[][],
    x: number,
    y: number,
    status: CellStatus,
    indexPlayer: number,
  ) {
    if (x >= 0 && x < field.length && y >= 0 && y < field.length) {
      if (field[y][x] === CellStatus.Empty) {
        field[y][x] = status;
        const attackResponse = this.createAttackResponseData(
          x,
          y,
          indexPlayer,
          AttackStatus.Miss,
        );
        console.log(`3. sendAttackResponse ${JSON.stringify(attackResponse)}`);
        sendAttackResponse(this, attackResponse);
      }
    }
  }

  private createAttackResponseData(
    x: number,
    y: number,
    currentPlayer: number,
    status: AttackStatus,
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
