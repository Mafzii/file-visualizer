class CanvasItem {
  x: number;
  y: number;
  connections: string[];

  constructor(x: number, y: number, connections: string[]) {
    this.x = x;
    this.y = y;
    this.connections = connections;
  }
}

export { CanvasItem };
