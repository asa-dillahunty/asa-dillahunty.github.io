import { squareState } from "./Sudoku";

export class SudokuGridSquare {
  x: number;
  y: number;

  i: number;
  j: number;

  value: number | null;
  size: number;

  state: squareState;

  constructor(x: number, y: number, i: number, j: number, size: number) {
    this.x = x;
    this.y = y;

    this.i = i;
    this.j = j;

    this.size = size;
    this.value = null;
    this.state = squareState.default;
  }

  draw(ctx: CanvasRenderingContext2D, selected: SudokuGridSquare | null) {
    // TODO: add logic for highlighting
    ctx.beginPath();
    ctx.clearRect(this.x, this.y, this.size, this.size);

    if (selected && selected.i === this.i && selected.j === this.j) {
      // the selected square
      ctx.fillStyle = "#a00";
      ctx.fillRect(this.x, this.y, this.size, this.size);
    } else if (selected && (selected.i === this.i || selected.j === this.j)) {
      // row or column
      ctx.fillStyle = "#400";
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    // else if () {
    //     // the square we are within
    // }

    ctx.strokeStyle = "#ccc";
    ctx.font = `${this.size / 2}px Arial`;
    ctx.lineWidth = 1;

    if (selected && selected.value === this.value) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
    }

    if (this.value) {
      ctx.strokeText(
        this.value.toString(),
        this.x + this.size * 0.37,
        this.y + this.size * 0.69
      );
    }
    ctx.closePath();
  }
}
