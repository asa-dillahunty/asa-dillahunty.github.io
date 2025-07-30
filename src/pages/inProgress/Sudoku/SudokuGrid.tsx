import { SudokuGridSquare } from "./SudokuGridSquare";

export enum puzzleDifficulty {
  easy,
  medium,
  hard,
}

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class SudokuGrid {
  x: number;
  y: number;
  size: number;
  width: number;
  height: number;
  squares: SudokuGridSquare[][];
  selected: SudokuGridSquare | null;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.width = size;
    this.height = size;

    this.squares = this.makeEmptyGrid();
    this.selected = null;
    this.generatePuzzle(puzzleDifficulty.easy);
    // this.randomizeGrid();
  }

  // assume x and y adjusted so 0, 0 is the top left of my boundary (this.x, this.y)
  clickWithin(clickedX: number, clickedY: number) {
    const i = Math.floor((clickedX * 9) / this.size);
    const j = Math.floor((clickedY * 9) / this.size);

    if (this.selected && this.selected === this.squares[i][j]) {
      this.selected = null;
    } else {
      this.selected = this.squares[i][j];
    }
  }

  makeEmptyGrid() {
    const newGrid: SudokuGridSquare[][] = [];
    const squareSize = this.size / 9;

    for (let i = 0; i < 9; i++) {
      const gridRow: SudokuGridSquare[] = [];
      for (let j = 0; j < 9; j++) {
        const squareX = squareSize * i + this.x;
        const squareY = squareSize * j + this.y;
        // .5 is added to account for the lines being drawn
        gridRow.push(
          new SudokuGridSquare(
            squareX + 0.5,
            squareY + 0.5,
            i,
            j,
            squareSize - 1
          )
        );
      }
      newGrid.push(gridRow);
    }
    return newGrid;
  }

  generatePuzzle(difficulty: puzzleDifficulty) {
    this.seedRandoms();
  }

  randomizeGrid() {
    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[i].length; j++) {
        if (Math.random() > 0.7) {
          this.squares[i][j].value = Math.ceil(Math.random() * 9);
        }
      }
    }
  }

  getRandomCord() {
    const i = Math.floor(Math.random() * 9);
    const j = Math.floor(Math.random() * 9);
    return [i, j];
  }

  seedRandoms() {
    for (let val = 1; val <= 9; val++) {
      const [i, j] = this.getRandomCord();

      if (this.squares[i][j].value) {
        // occupied, try again
        val--;
        continue;
      } else {
        this.squares[i][j].value = val;
      }
    }
  }

  solvePuzzle() {
    const findNextEmpty = () => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          // try something in
        }
      }
    };
    const solutionStack = [];
    // add to solution stack
  }

  getOptions(i: number, j: number) {
    const unusedSet = new Set(options);
    for (let index = 0; index < 9; index++) {
      // all in same row
      unusedSet.delete(this.squares[i][index].value || 0);

      // all in same column
      unusedSet.delete(this.squares[index][j].value || 0);
    }

    // all in same square
    const squareI = Math.floor(i / 3) * 3;
    const squareJ = Math.floor(j / 3) * 3;

    for (let di = 0; di < 3; di++) {
      for (let dj = 0; dj < 3; dj++) {
        unusedSet.delete(this.squares[squareI + di][squareJ + dj].value || 0);
      }
    }

    return [...unusedSet];
  }

  drawAllSquares(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[i].length; j++) {
        this.squares[i][j].draw(ctx, this.selected);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    ctx.clearRect(this.x, this.y, this.size, this.size);
    ctx.strokeStyle = "#ccc";
    ctx.font = "28px Arial";
    ctx.lineWidth = 2;

    this.drawAllSquares(ctx);

    // we do 10 to draw the board's border
    for (let i = 0; i < 10; i++) {
      ctx.lineWidth = 2;
      if (i === 3 || i === 6) {
        ctx.lineWidth = 8;
      }

      // horizontal line
      ctx.beginPath();
      const xVal = i * (this.size / 9) + this.y;
      ctx.moveTo(this.x, xVal);
      ctx.lineTo(this.size + this.x, xVal);
      ctx.stroke();
      ctx.closePath();

      // vertical lines
      ctx.beginPath();
      const yVal = i * (this.size / 9) + this.x;
      ctx.moveTo(yVal, this.y);
      ctx.lineTo(yVal, this.size + this.y);
      ctx.stroke();
      ctx.closePath();
    }
    ctx.closePath();
  }
}
