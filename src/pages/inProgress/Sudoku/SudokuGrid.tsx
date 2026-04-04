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

  used: Set<SudokuGridSquare>;
  unused: Set<SudokuGridSquare>;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.width = size;
    this.height = size;

    this.squares = this.makeEmptyGrid();
    this.selected = null;

    this.used = new Set();
    this.unused = new Set(this.squares.flat());

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

  use(gridSquare: SudokuGridSquare) {
    this.unused.delete(gridSquare);
    this.used.add(gridSquare);
  }

  unuse(gridSquare: SudokuGridSquare) {
    this.used.delete(gridSquare);
    this.unused.add(gridSquare);
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
            squareSize - 1,
          ),
        );
      }
      newGrid.push(gridRow);
    }
    return newGrid;
  }

  generatePuzzle(difficulty: puzzleDifficulty) {
    this.seedRandomsFirstRow();
    this.solvePuzzle();
    console.log("puzzle solved");
    this.removeNumbersRandomly();
    console.log("numbers removed");
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

  getRandomUnused() {
    // sets cannot get elements randomly
    const unusedAsArray = Array.from(this.unused);
    if (unusedAsArray.length < 1) {
      return null;
    }

    const chosen =
      unusedAsArray[Math.floor(Math.random() * unusedAsArray.length)];
    // we do not remove the chosen, because we're not actually using it here
    return chosen;
  }

  getBestUnused() {
    let best = null;
    let bestOptions = 10;

    const unusedAsArray = Array.from(this.unused);
    shuffleArray(unusedAsArray);

    for (const cell of unusedAsArray) {
      const opts = this.getOptions(cell.i, cell.j);
      if (opts.length < bestOptions) {
        best = cell;
        bestOptions = opts.length;
        if (bestOptions < 2) break; // can't get better than 1 (or zero)
      }
    }

    return best;
  }

  getRandomUsed() {
    // sets cannot get elements randomly
    const usedAsArray = Array.from(this.used);
    if (usedAsArray.length < 1) {
      return null;
    }

    const chosen = usedAsArray[Math.floor(Math.random() * usedAsArray.length)];
    // we do not remove the chosen, because we're not actually using it here
    return chosen;
  }

  seedRandoms() {
    for (let val = 1; val <= 9; val++) {
      const chosen = this.getRandomUnused();

      if (!chosen || this.squares[chosen.i][chosen.j].value)
        throw new Error("Internal Data Structures Not Reset Properly");

      this.squares[chosen.i][chosen.j].value = val;
      this.use(chosen);
    }
  }

  seedRandomsFirstRow() {
    const row = options.slice();
    shuffleArray(row);
    for (let i = 0; i < 9; i++) {
      this.squares[i][0].value = row[i];
      this.use(this.squares[i][0]);
    }
  }

  anyBreakers() {
    const unusedAsArray = Array.from(this.unused);
    let options;
    for (const cell of unusedAsArray) {
      options = this.getOptions(cell.i, cell.j);
      if (options.length < 1) {
        console.log("broken");
        return true;
      }
    }

    return false;
  }

  solvePuzzle() {
    const curr = this.getBestUnused();
    if (curr === null) return solveResult.done; // this can't happen or this means it's done
    this.use(curr);

    const options = this.getOptions(curr.i, curr.j);
    shuffleArray(options);

    for (let i = 0; i < options.length; i++) {
      // try option[i]
      curr.value = options[i];

      const result = this.solvePuzzle();
      if (result === solveResult.done) {
        return solveResult.done;
      } else if (result === solveResult.fail) {
        // try again
        continue;
      }
    }
    // made it all the way out and we failed
    curr.value = null;
    this.unuse(curr);
    return solveResult.fail;
  }

  /* how to ensure a single solution?
  1. Brute Force? We could search through all possible solutions?
    a. can we still use get best unused? and then just try all options instead of one
  */

  // brute force solution
  countSolutions() {
    // so this function implies the sudoku puzzle is partially complete
    const curr = this.getBestUnused();
    if (curr === null) return 1; // we've found a solution
    this.use(curr);

    const options = this.getOptions(curr.i, curr.j);
    // shuffleArray(options); shuffle is unnecessary since we will check all options

    let solutions = 0;

    for (let i = 0; i < options.length; i++) {
      // try option[i] and count solutions where that's the answer
      curr.value = options[i];
      solutions += this.countSolutions();
    }

    curr.value = null;
    this.unuse(curr);

    // how many did we find?
    return solutions;
  }

  // remove until more than one solution
  removeNumbersRandomly() {
    console.log("removing a number randomly");
    // this should also be recursive. That way I can pass it back up and undo a 'removal' without keeping track in a data structure
    // grab a square randomly
    const curr = this.getRandomUsed();
    if (curr === null)
      throw new Error("Internal Data Structures Not Reset Properly");

    // make it null
    const currVal = curr.value;
    curr.value = null;
    this.unuse(curr);

    const solutions = this.countSolutions();
    if (solutions === 1) {
      this.removeNumbersRandomly();
    } else {
      // add it back
      curr.value = currVal;
      this.use(curr);
    }
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

enum solveResult {
  done,
  fail,
  prune,
}

// Fisher-Yates
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
