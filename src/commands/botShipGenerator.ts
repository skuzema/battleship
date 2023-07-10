import { Ship, ShipType } from '../models/types';

export function randomShips(): Ship[] {
  const battleFieldSize = 10;
  const ships: Ship[] = [];

  // Function to check if a ship can be placed at the specified position
  const canPlaceShip = (
    x: number,
    y: number,
    length: number,
    direction: boolean,
  ): boolean => {
    // Check if the ship goes out of bounds
    if (
      (direction && x + length > battleFieldSize) ||
      (!direction && y + length > battleFieldSize)
    ) {
      return false;
    }

    // Check if the ship overlaps with any existing ships or is adjacent to them
    for (const ship of ships) {
      if (direction) {
        // Check horizontal placement
        if (
          y === ship.position.y &&
          x <= ship.position.x + ship.length &&
          x + length >= ship.position.x
        ) {
          return false;
        }
        // Check adjacency
        if (
          Math.abs(ship.position.y - y) <= 1 &&
          x <= ship.position.x + ship.length &&
          x + length >= ship.position.x - 1
        ) {
          return false;
        }
      } else {
        // Check vertical placement
        if (
          x === ship.position.x &&
          y <= ship.position.y + ship.length &&
          y + length >= ship.position.y
        ) {
          return false;
        }
        // Check adjacency
        if (
          Math.abs(ship.position.x - x) <= 1 &&
          y <= ship.position.y + ship.length &&
          y + length >= ship.position.y - 1
        ) {
          return false;
        }
      }
    }

    return true;
  };

  // Function to place a ship at the specified position
  const placeShip = (
    x: number,
    y: number,
    length: number,
    direction: boolean,
    type: ShipType,
  ): void => {
    ships.push({
      position: { x, y },
      direction,
      length,
      type,
    });
  };

  // Place the "huge" ship (1x4)
  let x = getRandomNumber(battleFieldSize);
  let y = getRandomNumber(battleFieldSize);
  let direction = getRandomDirection();
  while (!canPlaceShip(x, y, 4, direction)) {
    x = getRandomNumber(battleFieldSize);
    y = getRandomNumber(battleFieldSize);
    direction = getRandomDirection();
  }
  placeShip(x, y, 4, direction, ShipType.huge);

  // Place the "large" ships (1x3)
  for (let i = 0; i < 2; i++) {
    x = getRandomNumber(battleFieldSize);
    y = getRandomNumber(battleFieldSize);
    direction = getRandomDirection();
    while (!canPlaceShip(x, y, 3, direction)) {
      x = getRandomNumber(battleFieldSize);
      y = getRandomNumber(battleFieldSize);
      direction = getRandomDirection();
    }
    placeShip(x, y, 3, direction, ShipType.large);
  }

  // Place the "medium" ships (1x2)
  for (let i = 0; i < 3; i++) {
    x = getRandomNumber(battleFieldSize);
    y = getRandomNumber(battleFieldSize);
    direction = getRandomDirection();
    while (!canPlaceShip(x, y, 2, direction)) {
      x = getRandomNumber(battleFieldSize);
      y = getRandomNumber(battleFieldSize);
      direction = getRandomDirection();
    }
    placeShip(x, y, 2, direction, ShipType.medium);
  }

  // Place the "small" ships (1x2)
  for (let i = 0; i < 4; i++) {
    x = getRandomNumber(battleFieldSize);
    y = getRandomNumber(battleFieldSize);
    direction = getRandomDirection();
    while (!canPlaceShip(x, y, 1, direction)) {
      x = getRandomNumber(battleFieldSize);
      y = getRandomNumber(battleFieldSize);
      direction = getRandomDirection();
    }
    placeShip(x, y, 1, direction, ShipType.small);
  }

  return ships;
}

function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

function getRandomDirection(): boolean {
  return Math.random() < 0.5;
}
