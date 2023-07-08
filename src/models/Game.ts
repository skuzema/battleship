import { Player } from "./types";

export class Game {
  private gameId: number;
  private players: Player[];

  constructor(gameId: number) {
    this.gameId = gameId;
    this.players = [];
  }

  // Getters
  getGameId(): number {
    return this.gameId;
  }

  // Game operations
  addPlayer(player: Player): void {
    this.players.push(player);
  }

  // Other methods
  // ...
}
