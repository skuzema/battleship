import {
  WebSocketWithId,
  Room,
  Ship,
  Game,
  RegResponseData,
} from '../models/types';
import { Player } from './Player';

export class Database {
  private players = new Map<number, Player>();
  private rooms: Room[] = [];
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
      console.log(`createPlayer, responseData: ${JSON.stringify(responseData)}`);
      this.players.forEach(function (value, key) {
        console.log(
          `createPlayer, players = key: ${key} value: ${JSON.stringify({index: value.index, name: value.name})}`,
        );
      });

      return responseData;
    } else {
      console.log(`createPlayer, validationError: ${JSON.stringify(validationError)}`);
      return validationError;
    }
  }

  private validatePlayer(
    name: string,
    password: string,
  ): RegResponseData | null {
    const validationResult:RegResponseData = {
        name: name,
        index: 0,
        error: true,
        errorText: ''
    };
    for (const player of this.players.values()) {
      if (player.name === name) {
        validationResult.errorText = 'The player is already registered!';
        return validationResult;
      }
    }
    if (name.length < 5) {
      validationResult.errorText ='Player name should be longer than 5 characters.';
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
  public createRoom(name: string): Room {
    const room: Room = {
      id: this.nextRoomId++,
      name,
      players: [],
    };
    this.rooms.push(room);
    return room;
  }

  public getRoom(id: number): Room | undefined {
    return this.rooms.find((room) => room.id === id);
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

  public getShip(id: number): Ship | undefined {
    return this.ships.find((ship) => ship.id === id);
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

  public getGame(id: number): Game | undefined {
    return this.games.find((game) => game.id === id);
  }
}
