export class Ship {
  private position: { x: number; y: number };
  private direction: boolean;
  private length: number;
  private type: 'small' | 'medium' | 'large' | 'huge';

  constructor(
    position: { x: number; y: number },
    direction: boolean,
    length: number,
    type: 'small' | 'medium' | 'large' | 'huge',
  ) {
    this.position = position;
    this.direction = direction;
    this.length = length;
    this.type = type;
  }

  // Getters
  getPosition(): { x: number; y: number } {
    return this.position;
  }

  // Other methods
  // ...
}
