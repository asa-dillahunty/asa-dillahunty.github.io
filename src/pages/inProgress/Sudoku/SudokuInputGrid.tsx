export class SudokuInputBar {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;
  }

  clickWithin(x: number, y: number) {
    console.log("clicked within input");
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#0b0";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
