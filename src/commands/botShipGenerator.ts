import { Ship, ShipType } from '../models/types';

function randomDirection(): boolean {
  return Math.random() < 0.5;
}

function getRandomPosition(): { x: number; y: number } {
  return {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  };
}

function isCellEmpty(field: number[][], x: number, y: number): boolean {
  return (
    x >= 0 &&
    x < field.length &&
    y >= 0 &&
    y < field.length &&
    field[y][x] === 0
  );
}

export function randomShips(): Ship[] {
  const ships: Ship[] = [];
  const shipTypes: ShipType[] = [
    ShipType.huge,
    ShipType.large,
    ShipType.large,
    ShipType.medium,
    ShipType.medium,
    ShipType.medium,
    ShipType.small,
    ShipType.small,
    ShipType.small,
    ShipType.small,
  ];

  const field: number[][] = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => 0),
  );

  for (let i = 0; i < shipTypes.length; i++) {
    const type = shipTypes[i];
    const length = getShipLength(type);
    const direction = randomDirection();

    let position = getRandomPosition();
    let validPosition = false;
    let count = 0;

    while (!validPosition && count < 1000) {
      count++;
      validPosition = true;

      // Check if the ship touches any existing ship or goes out of bounds
      if (direction) {
        for (let j = -1; j <= length; j++) {
          if (
            !isCellEmpty(field, position.x, position.y + j) ||
            !isCellEmpty(field, position.x - 1, position.y + j) ||
            !isCellEmpty(field, position.x + 1, position.y + j)
          ) {
            validPosition = false;
            break;
          }
        }
      } else {
        for (let j = -1; j <= length; j++) {
          if (
            !isCellEmpty(field, position.x + j, position.y) ||
            !isCellEmpty(field, position.x + j, position.y - 1) ||
            !isCellEmpty(field, position.x + j, position.y + 1)
          ) {
            validPosition = false;
            break;
          }
        }
      }

      if (!validPosition) {
        position = getRandomPosition();
      }
    }

    // Mark the cells occupied by the ship
    if (direction) {
      for (let j = 0; j < length; j++) {
        field[position.y + j][position.x] = 1;
      }
    } else {
      for (let j = 0; j < length; j++) {
        field[position.y][position.x + j] = 1;
      }
    }

    const ship: Ship = {
      position,
      direction,
      length,
      type,
    };

    ships.push(ship);
  }
  return ships;
}

function getShipLength(type: ShipType): number {
  switch (type) {
    case ShipType.huge:
      return 4;
    case ShipType.large:
      return 3;
    case ShipType.medium:
      return 2;
    case ShipType.small:
      return 1;
    default:
      return 1;
  }
}
