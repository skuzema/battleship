import { WebSocketWithId, RegResponseData, Winners } from '../models/types';
import { Player } from './Player';
import { Room } from './Room';
import { Game } from './Game';
import {
  sendFinishGame,
  sendUpdateWinners,
  sendUpdateRoomState,
} from '../commands/messageSender';

export class Database {
  private players = new Map<number, Player>();
  private rooms = new Map<number, Room>();
  private games = new Map<number, Game>();

  private nextPlayerId = 0;
  private nextRoomId = 0;
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

  public getWinners(): Winners[] {
    const res: Winners[] = [];
    this.players.forEach(function (value) {
      if (value.wins > 0) {
        res.push({
          name: value.name,
          wins: value.wins,
        });
      }
    });
    res.sort((a, b) => b.wins - a.wins);
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

  public addPlayerToRoom(roomId: number, playerId: number): Game | null {
    const room = this.rooms.get(roomId);
    const player = this.players.get(playerId);
    if (room && player) {
      if (room.addPlayerToRoom(player) > 1) {
        console.log('addPlayerToRoom > 1');
        this.nextGameId++;
        const game = new Game(this.nextGameId, room);
        this.games.set(this.nextRoomId, game);
        return game;
      }
      console.log('addPlayerToRoom = 1');
    }
    return null;
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

  // Game methods
  public getGameById(gameId: number): Game | undefined {
    return this.games.get(gameId);
  }

  // Additional Database methods
  public deletePlayer(playerId: number): boolean {
    if (this.players.delete(playerId)) {
      return true;
    }
    return false;
  }

  public deleteRoom(roomId: number): boolean {
    console.log(`deleteRoom 1:`);
    if (this.rooms.delete(roomId)) {
      console.log(`deleteRoom Ok!`);
      return true;
    }
    return false;
  }

  public deleteGame(gameId: number): boolean {
    console.log(`deleteGame 1:`);
    if (this.games.delete(gameId)) {
      console.log(`deleteGame Ok!`);
      return true;
    }
    return false;
  }

  public findUserInGame(playerId: number): Game | undefined {
    let returnObject: Game | undefined = undefined;
    let isFound = false;
    console.log(`findUserInGame 1.`);
    this.games.forEach(function (value) {
      console.log(`findUserInGame 2.`);
      value.room.players.forEach(function (value1) {
        console.log(
          `findUserInGame 3. value1.index === playerId ${
            value1.index === playerId
          }`,
        );
        if (value1.index === playerId) {
          console.log(`findUserInGame 4. ${value1.index}`);
          isFound = true;
        }
      });
      if (isFound) {
        console.log(`findUserInGame 3a. ${value}`);
        returnObject = value;
      }
    });
    console.log(`findUserInGame 1a  ${returnObject}`);
    return returnObject;
  }

  public findUserInRoom(playerId: number): Room | undefined {
    let returnObject: Room | undefined = undefined;
    let isFound = false;
    console.log(`findUserInRoom 1.`);
    this.rooms.forEach(function (value) {
      console.log(`findUserInRoom 2.`);
      value.players.forEach(function (value1) {
        console.log(
          `findUserInRoom 3. value1.index === playerId ${
            value1.index === playerId
          }`,
        );
        if (value1.index === playerId) {
          console.log(`findUserInRoom 4. ${value1.index}`);
          isFound = true;
        }
      });
      if (isFound) {
        console.log(`findUserInRoom 3a. ${value}`);
        returnObject = value;
      }
    });
    console.log(`findUserInRoom 1a  ${returnObject}`);
    return returnObject;
  }

  public disconnectPlayer(playerId: number): void {
    const player = this.players.get(playerId);
    console.log(`disconnectPlayer 1. player: ${player}`);
    if (player) {
      const room = this.findUserInRoom(playerId);
      console.log(`disconnectPlayer 2. room: ${room}`);
      if (room) {
        const game = this.findUserInGame(playerId);
        console.log(`disconnectPlayer 3. game: ${game}`);
        if (game) {
          const enemyPlayerId = game.getEnemyPlayerId(playerId);
          if (enemyPlayerId) {
            game.finishGameIfDisconnected(enemyPlayerId);
            sendFinishGame(game, enemyPlayerId);
            sendUpdateWinners(this);
            this.deleteRoom(room.id);
            this.deleteGame(game.id);
          }
        } else {
          // room.removePlayerById(playerId);
          this.deleteRoom(room.id);
          sendUpdateRoomState(this);
        }
      }
    }
    this.deletePlayer(playerId);
  }
}
