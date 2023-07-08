import { Player } from '../models/types';

export class Room {
  private roomId: number;
  private roomUsers: Player[];

  constructor(roomId: number) {
    this.roomId = roomId;
    this.roomUsers = [];
  }

  // Getters
  getRoomId(): number {
    return this.roomId;
  }

  // Room operations
  addUserToRoom(player: Player): void {
    this.roomUsers.push(player);
  }

  // Other methods
  // ...
}
