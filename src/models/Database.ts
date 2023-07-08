import { WebSocketWithId, Ship, Game, RegResponseData } from '../models/types';
import { Player } from './Player';
import { Room } from './Room';

export class Database {
  private players = new Map<number, Player>();
  private rooms = new Map<number, Room>();
  private ships: Ship[] = [];
  private games: Game[] = [];

  private nextPlayerId = 0;
  private nextRoomId = 0;
  private nextShipId = 0;
  private nextGameId = 0;

  // Player methods
  public createPlayer(
    ws: WebSocketWithId,
    name: string,
    password: string,
  ): RegResponseData {
    const responseData: RegResponseData = {
      name: '',
      index: 0,
      error: false,
      errorText: '',
    };
    const validationError = this.validatePlayer(name, password);
    if (!validationError) {
      this.nextPlayerId = ws.connectionId;
      const player = new Player(ws, this.nextPlayerId, name, password);
      this.players.set(this.nextPlayerId, player);
      responseData.name = player.name;
      responseData.index = player.index;
      console.log(
        `createPlayer, responseData: ${JSON.stringify(responseData)}`,
      );
      this.players.forEach(function (value, key) {
        console.log(
          `createPlayer, player key: ${key} value: ${JSON.stringify({
            index: value.index,
            name: value.name,
          })}`,
        );
      });

      return responseData;
    } else {
      console.log(
        `createPlayer, validationError: ${JSON.stringify(validationError)}`,
      );
      return validationError;
    }
  }

  public getPlayers(): Player[] {
    const res: Player[] = [];
    this.players.forEach(function (value) {
      res.push(value);
    });
    return res;
  }

  private validatePlayer(
    name: string,
    password: string,
  ): RegResponseData | null {
    const validationResult: RegResponseData = {
      name: name,
      index: 0,
      error: true,
      errorText: '',
    };
    for (const player of this.players.values()) {
      if (player.name === name) {
        validationResult.errorText = 'The player is already registered!';
        return validationResult;
      }
    }
    if (name.length < 5) {
      validationResult.errorText =
        'Player name should be longer than 5 characters.';
      return validationResult;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    if (!passwordRegex.test(password)) {
      validationResult.errorText =
        'Invalid password format. Password should be minimum 5 characters, at least one letter and one number';
      return validationResult;
    }
    return null;
  }

  // Room methods
  public createRoom(ws: WebSocketWithId): Map<number, Room> | null {
    if (this.playerInRoom(ws.connectionId)) {
      return null;
    }
    this.nextRoomId++;
    const room = new Room(this.nextRoomId, this.players.get(ws.connectionId));
    this.rooms.set(this.nextRoomId, room);
    this.rooms.forEach(function (value, key) {
      console.log(
        `createRoom, room key: ${key} value: ${JSON.stringify({
          id: value.id,
          name: value.name,
        })}`,
      );
      value.players.forEach(function (value1, key1) {
        console.log(
          `createRoom, player key: ${key1} value: ${JSON.stringify({
            index: value1.index,
            name: value1.name,
          })}`,
        );
      });
    });
    return this.rooms;
  }

  public getRoomsWithSinglePlayer(): Room[] {
    const singlePlayerRooms: Room[] = [];
    this.rooms.forEach(function (value) {
      if (value.players.length < 2) {
        singlePlayerRooms.push(value);
      }
    });
    return singlePlayerRooms;
  }

  private playerInRoom(playerId: number): boolean {
    let returnValue = false;
    this.rooms.forEach(function (value) {
      if (value.players.find((o) => o.index === playerId)) {
        returnValue = true;
      }
    });
    return returnValue;
  }

  // Ship methods
  public createShip(type: string, position: { x: number; y: number }): Ship {
    const ship: Ship = {
      id: this.nextShipId++,
      type,
      position,
    };
    this.ships.push(ship);
    return ship;
  }

  // Game methods
  public createGame(players: Player[], ships: Ship[]): Game {
    const game: Game = {
      id: this.nextGameId++,
      players,
      ships,
    };
    this.games.push(game);
    return game;
  }
}
