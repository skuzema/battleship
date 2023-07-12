import { WebSocketWithId, RegResponseData, Winners } from '../models/types';
import { Player } from './Player';
import { Room } from './Room';
import { Game } from './Game';
import { Bot } from './Bot';

import {
  sendFinishGame,
  sendUpdateWinners,
  sendUpdateRoomState,
} from '../commands/messageSender';

export class Database {
  private players = new Map<number, Player>();
  private rooms = new Map<number, Room>();
  private games = new Map<number, Game>();
  private bots = new Map<number, Bot>();

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

      return responseData;
    } else {
      return validationError;
    }
  }

  public createBot(db: Database, playerId: number) {
    const bot: Bot = new Bot(db, playerId);
    this.bots.set(playerId, bot);
    bot.initBot();
  }

  public deleteBot(bot: Bot, playerId: number) {
    bot.ws.close();
    this.bots.delete(playerId);
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

    return this.rooms;
  }

  public addPlayerToRoom(roomId: number, playerId: number): Game | null {
    const room = this.rooms.get(roomId);
    const player = this.players.get(playerId);
    if (room && player) {
      const userExistInRoom = this.findUserInRoom(playerId);
      if (userExistInRoom) {
        if (userExistInRoom.id === roomId) {
          return null;
        }
        this.deleteRoom(userExistInRoom.id);
      }
      if (room.addPlayerToRoom(player) > 1) {
        this.nextGameId++;
        const game = new Game(this.nextGameId, room);
        this.games.set(this.nextGameId, game);
        return game;
      }
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
    if (this.rooms.delete(roomId)) {
      return true;
    }
    return false;
  }

  public deleteGame(gameId: number): boolean {
    if (this.games.delete(gameId)) {
      return true;
    }
    return false;
  }

  public findUserInGame(playerId: number): Game | undefined {
    let returnObject: Game | undefined = undefined;
    this.games.forEach(function (value) {
      value.room.players.forEach(function (value1) {
        if (value1.index === playerId) {
          returnObject = value;
        }
      });
    });
    return returnObject;
  }

  public findUserInRoom(playerId: number): Room | undefined {
    let returnObject: Room | undefined = undefined;
    this.rooms.forEach(function (value) {
      value.players.forEach(function (value1) {
        if (value1.index === playerId) {
          returnObject = value;
        }
      });
    });
    return returnObject;
  }

  public disconnectPlayer(playerId: number): void {
    const player = this.players.get(playerId);
    if (player) {
      const room = this.findUserInRoom(playerId);
      if (room) {
        const game = this.findUserInGame(playerId);
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
          this.deleteRoom(room.id);
          sendUpdateRoomState(this);
        }
      }
    }
    this.deletePlayer(playerId);
  }
}
