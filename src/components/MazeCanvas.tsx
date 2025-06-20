import { useContext, useEffect, useRef, useState } from "react";
import styles from "./stylesheets/MazeCanvas.module.scss";

import { MazeColorsType, ThemeContext } from "../utils/ThemeContext";
import { ICompare, PriorityQueue } from "@datastructures-js/priority-queue";

// const TARGET_FPS = 20;
const TARGET_FPS = 60;
// const TARGET_AREA = 20;
// const TARGET_AREA = 200;
// const TARGET_AREA = 500;
const TARGET_AREA = 5000;
// const STEPS_PER_FRAME = 1;
const STEPS_PER_FRAME = 10;
// const STEPS_PER_FRAME = 30;

export type MazeCanvasProps = {
  container: { width: number; height: number };
};

export default function MazeCanvas({ container }: MazeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cancelAnimationRef = useRef<() => void>(() => {});
  const cancelledRef = useRef(false);
  // const [mazeColors, setMazeColors] = useState<MazeColorsType>();
  const { mazeColors } = useContext(ThemeContext);
  const [mazeInstance, setMazeInstance] = useState<Maze>();

  useEffect(() => {
    if (!container?.height || !container?.width || !mazeColors) return;
    const canvas = canvasRef.current;
    if (cancelledRef.current) {
      cancelledRef.current = false;
      cancelAnimationRef.current();
    }
    if (!canvas) return;

    canvas.width = container.width;
    canvas.height = container.height;

    const isCancelled = () => cancelledRef.current;
    const setCancel = (cancelFn: () => void) => {
      cancelAnimationRef.current = cancelFn;
    };

    const mazeInstance = new Maze(canvas, container, mazeColors);
    setCancel(step(mazeInstance, isCancelled));
    setMazeInstance(mazeInstance);

    return () => {
      cancelledRef.current = true;
      cancelAnimationRef.current();
    };
  }, [canvasRef, container]);

  useEffect(() => {
    if (mazeColors && mazeInstance) {
      mazeInstance?.setColors(mazeColors);
      // mazeInstance.render();
    }
  }, [mazeColors]);

  if (!container?.height || !container?.width) {
    return <canvas className={styles.hidden} ref={canvasRef}></canvas>;
  }
  return <canvas className={styles.canvas} ref={canvasRef}></canvas>;
}

function step(maze: Maze, isCancelled: () => boolean) {
  let lastTime = 0;
  const fpsInterval = 1000 / TARGET_FPS;
  let frameId = 0;

  function animate(time: number) {
    if (isCancelled()) return;

    if (time - lastTime >= fpsInterval) {
      lastTime = time;
      for (let i = 0; i < STEPS_PER_FRAME; i++) {
        const result = maze.step();
        if (result === "done") {
          maze.render(); // this render is to make sure the 'finish' is drawn
          if (
            maze.stepType === "build-prim" ||
            maze.stepType === "build-rb" ||
            maze.stepType === "build-mixed"
          ) {
            maze.stepType = maze.getRandomSolveStepType();
          } else {
            maze.reset();
          }
        }
      }
    }
    frameId = requestAnimationFrame(animate);
  }
  frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
}

/* -------------------- Maze Object & Types -------------------- */

class Maze {
  CELL = 1;
  WALL = 2;
  VISITED = 3;
  DEADEND = 4;
  SOLUTION = 5;
  ENQUEUED = 6;
  A_VISITED = 7;
  GOAL_AREA = TARGET_AREA;

  height = 0;
  width = 0;
  renderScale = 0;
  matrix: number[][];
  buildList: number[];
  solveList: number[];
  exploredQueue: PriorityQueue<SearchNode>;
  currSearchNode: SearchNode | null;
  mazeCanvasRef: HTMLCanvasElement;
  container: { width: number; height: number };
  stepType: string;

  colors: MazeColorsType;

  constructor(
    mazeCanvas: HTMLCanvasElement,
    container: { width: number; height: number },
    colors: MazeColorsType
  ) {
    this.mazeCanvasRef = mazeCanvas;
    this.container = container;
    this.colors = colors;

    this.matrix = [];
    this.buildList = [];
    this.solveList = [];
    this.exploredQueue = new PriorityQueue<SearchNode>(compareNodes);
    this.currSearchNode = null;
    this.stepType = this.getRandomBuildStepType();

    this.resetSize();
    this.initMatrix();
    // this.render();
    this.blankSlate();
  }

  setColors(colors: MazeColorsType) {
    this.colors = colors;
  }

  reset(): void {
    this.matrix = [];
    this.buildList = [];
    this.solveList = [];
    this.exploredQueue = new PriorityQueue<SearchNode>(compareNodes);
    this.currSearchNode = null;
    this.stepType = this.getRandomBuildStepType();

    this.resetSize();
    this.initMatrix();
    // this.render();
    this.blankSlate();
  }

  resetSize(): void {
    const canvHeight = this.container.height;
    const canvWidth = this.container.width;

    const realArea = canvHeight * canvWidth;
    const res = Math.sqrt(realArea / this.GOAL_AREA);
    const w = Math.floor(canvWidth / res);
    const h = Math.floor(canvHeight / res);

    this.width = w * 2 + 1;
    this.height = h * 2 + 1;

    this.renderScale = Math.floor(
      (canvWidth / this.width + canvHeight / this.height) / 2
    );

    // Adjust the grid until it fills the canvas nicely.
    while (this.width * this.renderScale < canvWidth) {
      this.width++;
    }
    if (this.width % 2 === 0) this.width--;
    while (this.height * this.renderScale < canvHeight) {
      this.height++;
    }
    if (this.height % 2 === 0) this.height--;

    this.mazeCanvasRef.height = this.height * this.renderScale;
    this.mazeCanvasRef.width = this.width * this.renderScale;
  }

  initMatrix(): void {
    for (let i = 0; i < this.width; i++) {
      let temp: number[] = [];
      for (let j = 0; j < this.height; j++) {
        temp.push(i % 2 === 1 && j % 2 === 1 ? this.CELL : this.WALL);
      }
      this.matrix.push(temp);
    }

    // entrance and exit.
    this.matrix[1][0] = this.CELL;
    this.matrix[this.width - 2][this.height - 1] = this.CELL;
  }

  step(): string {
    switch (this.stepType) {
      case "build-prim":
        return this.primMazeStep();
      case "build-rb":
        return this.RBMazeStep();
      case "build-mixed":
        return this.mixedBuildStep();
      case "solve-rb":
        return this.solveRBStep();
      case "solve-aStar":
        return this.solveAStarStep();
      default:
        return "done";
    }
  }

  RBMazeStep(): string {
    if (this.buildList.length < 1) {
      let n = Math.floor(Math.random() * (this.height - 1));
      let m = Math.floor(Math.random() * (this.width - 1));
      if (n % 2 === 0) n++;
      if (m % 2 === 0) m++;
      this.buildList.push(m * this.height + n);
    }

    let curr: number | undefined;
    let x: number, y: number, nx: number, ny: number, pos: number[];
    let next: number | null = null;
    while (this.buildList.length && next === null) {
      curr = this.buildList.pop();
      if (curr === undefined) return "not done";
      x = Math.floor(curr / this.height);
      y = curr % this.height;

      this.matrix[x][y] = this.VISITED;
      this.renderSquare(x, y);

      pos = this.getPos(curr, 2, [this.CELL]);
      if (pos.length === 0) continue;
      if (pos.length > 1) this.buildList.push(curr);

      next = getRandom(pos);
      this.buildList.push(next);

      nx = Math.floor(next / this.height);
      ny = next % this.height;
      this.matrix[nx][ny] = this.VISITED;
      this.renderSquare(nx, ny);

      const wallX = (x + nx) / 2;
      const wallY = (y + ny) / 2;
      this.matrix[wallX][wallY] = this.CELL;
      this.renderSquare(wallX, wallY);
    }
    return this.buildList.length === 0 ? "done" : "not done";
  }

  primMazeStep(): string {
    if (this.buildList.length < 1) {
      let n = Math.floor(Math.random() * (this.height - 1));
      let m = Math.floor(Math.random() * (this.width - 1));
      if (n % 2 === 0) n++;
      if (m % 2 === 0) m++;
      this.matrix[m][n] = this.VISITED;
      this.renderSquare(m, n);
      this.buildList.push(m * this.height + n);
    }

    let curr: number;
    let index: number;
    let x: number, y: number, nx: number, ny: number;
    let pos: number[];
    let next: number | null = null;
    while (this.buildList.length > 0 && next === null) {
      index = Math.floor(Math.random() * this.buildList.length);
      curr = this.buildList[index];
      x = Math.floor(curr / this.height);
      y = curr % this.height;

      pos = this.getPos(curr, 2, [this.CELL]);
      if (pos.length <= 1) {
        this.buildList.splice(index, 1);
        if (pos.length < 1) continue;
      }

      next = getRandom(pos);
      this.buildList.push(next);

      nx = Math.floor(next / this.height);
      ny = next % this.height;
      this.matrix[nx][ny] = this.VISITED;
      this.renderSquare(nx, ny);

      const wallX = (x + nx) / 2;
      const wallY = (y + ny) / 2;
      this.matrix[wallX][wallY] = this.CELL;
      this.renderSquare(wallX, wallY);
    }
    return this.buildList.length < 1 ? "done" : "not done";
  }

  mixedBuildStep(): string {
    if (Math.random() < 0.05) {
      return this.primMazeStep();
    } else {
      return this.RBMazeStep();
    }
  }

  getPos(cord: number, scale: number, allowed: number[]): number[] {
    let options: number[] = [];
    let dx: number, dy: number;
    const x = Math.floor(cord / this.height);
    const y = cord % this.height;
    const deltas = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ];

    for (let i = 0; i < deltas.length; i++) {
      try {
        dx = deltas[i].x * scale;
        dy = deltas[i].y * scale;
        const classification = this.matrix[x + dx][y + dy];
        if (!classification) continue;
        for (let j = 0; j < allowed.length; j++) {
          if (classification === allowed[j]) {
            options.push(cord + dx * this.height + dy);
            break;
          }
        }
      } catch (err) {
        continue;
      }
    }
    return options;
  }

  getRandomBuildStepType(): string {
    const rand = Math.random();
    if (rand > 0.7) {
      return "build-mixed";
    } else if (rand > 0.5) {
      return "build-prim";
    } else {
      return "build-rb";
    }
  }

  getRandomSolveStepType(): string {
    return Math.random() > 0.7 ? "solve-aStar" : "solve-rb";
  }

  solveRBStep(): string {
    const end = this.height * (this.width - 2) + this.height - 1;
    if (this.solveList.length < 1) {
      this.solveList.push(this.height);
    }
    let curr: number = 0;
    let x: number, y: number;
    let pos: number[];
    let next: number | null = null;
    while (this.solveList.length && next === null) {
      curr = this.solveList.pop()!;
      x = Math.floor(curr / this.height);
      y = curr % this.height;

      this.matrix[x][y] = this.SOLUTION;
      this.renderSquare(x, y);

      if (curr === end) {
        return "done";
      }

      pos = this.getPos(curr, 1, [this.CELL, this.VISITED]);
      if (pos.length === 0) {
        this.matrix[x][y] = this.DEADEND;
        this.renderSquare(x, y);
        return "not done";
      }
      this.solveList.push(curr);
      next = getRandom(pos);
      this.solveList.push(next);
    }
    return curr === end ? "done" : "not done";
  }

  solveAStarStep(): string {
    const end = new SearchNode(
      new MazeCord(this.width - 2, this.height - 1),
      null,
      0
    );

    if (this.exploredQueue.isEmpty() && this.currSearchNode === null) {
      const startCord = new MazeCord(1, 0);
      const startNode = new SearchNode(startCord, null, 0);
      this.exploredQueue.enqueue(startNode);
    }

    while (this.exploredQueue.isEmpty() === false) {
      const curr = this.exploredQueue.dequeue();
      if (!curr) break;

      if (curr.equals(end)) {
        // we've found the end
        this.currSearchNode = curr;
        this.exploredQueue.clear();
        this.matrix[curr.cord.x][curr.cord.y] = this.SOLUTION;
        this.renderSquare(curr.cord.x, curr.cord.y);
        return "not done";
      }

      // visit curr
      this.matrix[curr.cord.x][curr.cord.y] = this.A_VISITED;
      this.renderSquare(curr.cord.x, curr.cord.y);

      // where do we go next?
      // add all ways 'out'
      const possibilities = this.getPos(
        curr.cord.x * this.height + curr.cord.y,
        1,
        [this.CELL, this.VISITED]
      );

      for (const pos of possibilities) {
        const newCord = oldToNew(pos, this.height);
        const newNode = new SearchNode(
          newCord,
          curr,
          newCord.prioritize(end.cord)
        );
        this.matrix[newCord.x][newCord.y] = this.ENQUEUED;
        this.renderSquare(newCord.x, newCord.y);
        this.exploredQueue.enqueue(newNode);
      }

      return "not done";
    }

    if (this.exploredQueue.isEmpty()) {
      if (!this.currSearchNode?.predecessor) return "done";
      this.currSearchNode = this.currSearchNode.predecessor;

      this.matrix[this.currSearchNode.cord.x][this.currSearchNode.cord.y] =
        this.SOLUTION;
      this.renderSquare(this.currSearchNode.cord.x, this.currSearchNode.cord.y);
    }
    return "not done";
  }

  blankSlate(): void {
    if (!this.mazeCanvasRef) return;
    const ctx = this.mazeCanvasRef.getContext("2d");

    if (!ctx) return;
    // ctx.fillStyle = "#000";
    // ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    // ctx.fillStyle = "#16142a";
    // ctx.fillStyle = "#16142a00";
    ctx.fillStyle = this.colors.wall;

    ctx.fillRect(
      0,
      0,
      this.width * this.renderScale,
      this.height * this.renderScale
    );
  }

  render(): void {
    if (!this.mazeCanvasRef) return;
    // Set canvas size based on grid dimensions and scale.
    this.mazeCanvasRef.width = this.renderScale * this.width;
    this.mazeCanvasRef.height = this.renderScale * this.height;
    const ctx = this.mazeCanvasRef.getContext("2d");
    if (!ctx) return;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.renderSquare(i, j);
      }
    }
  }

  renderSquare(i: number, j: number): void {
    if (!this.mazeCanvasRef) return;
    const ctx = this.mazeCanvasRef.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = this.colors.default;
    if (this.matrix[i][j] === this.DEADEND) {
      ctx.fillStyle = this.colors.deadend;
    } else if (this.matrix[i][j] === this.SOLUTION) {
      ctx.fillStyle = this.colors.solution;
    } else if (this.matrix[i][j] === this.WALL) {
      ctx.fillStyle = this.colors.wall;
    } else if (this.matrix[i][j] === this.ENQUEUED) {
      ctx.fillStyle = this.colors.enqueued;
    } else if (this.matrix[i][j] === this.A_VISITED) {
      ctx.fillStyle = this.colors.visited;
    }

    ctx.fillRect(
      i * this.renderScale,
      j * this.renderScale,
      this.renderScale,
      this.renderScale
    );
  }
}

function getRandom(array: number[]): number {
  return array[Math.floor(Math.random() * array.length)];
}

function oldToNew(cord: number, height: number) {
  const x = Math.floor(cord / height);
  const y = cord % height;
  const newCord = new MazeCord(x, y);

  return newCord;
}

class MazeCord {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(versus: MazeCord) {
    if (versus.x === this.x && versus.y === this.y) {
      return true;
    } else return false;
  }

  prioritize(end: MazeCord) {
    return (this.x - end.x) ** 2 + (this.y - end.y) ** 2;
  }

  distance(versus: MazeCord) {
    return Math.sqrt((this.x - versus.x) ** 2 + (this.y - versus.y) ** 2);
  }
}

const compareNodes: ICompare<SearchNode> = (a: SearchNode, b: SearchNode) => {
  if (a.priority > b.priority) {
    return 1;
  }
  if (a.priority < b.priority) {
    return -1;
  }
  return 0;
};

class SearchNode {
  cord: MazeCord;
  predecessor: SearchNode | null;
  priority: number;

  constructor(
    cord: MazeCord,
    predecessor: SearchNode | null,
    priority: number
  ) {
    this.cord = cord;
    this.predecessor = predecessor;
    this.priority = priority;
  }

  equals(node: SearchNode) {
    return this.cord.equals(node.cord);
  }
}
