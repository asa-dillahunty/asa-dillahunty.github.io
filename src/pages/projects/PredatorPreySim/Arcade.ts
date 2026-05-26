import { Ghost } from "./Ghost";
import { Pacman } from "./Pacman";

export class Arcade {
  grid: Map<string, (Pacman | Ghost)[]>;
  cellSize: number;
  ghosts: Ghost[];
  pacs: Pacman[];
  toKill: (Ghost | Pacman)[];
  toBirth: (Ghost | Pacman)[];
  width: number;
  height: number;

  constructor(canvasWidth: number, canvasHeight: number, spriteSize: number) {
    this.grid = new Map();
    this.cellSize = Math.ceil(spriteSize * 4);
    this.ghosts = [];
    this.pacs = [];
    this.toKill = [];
    this.toBirth = [];
    this.width = canvasWidth;
    this.height = canvasHeight;
  }

  nearestPac(thingy: {
    x: number;
    y: number;
    distance: (x: number, y: number) => number;
  }): Pacman | null {
    let nearest: Pacman | null = null;
    let minDistance = Infinity;

    const nearby = this.getNearbyEntities(thingy.x, thingy.y);

    for (const entity of nearby) {
      if (entity instanceof Pacman && entity !== thingy) {
        const dist = thingy.distance(entity.x, entity.y);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = entity;
        }
      }
    }
    return nearest;
  }

  nearestGhost(thingy: {
    x: number;
    y: number;
    distance: (x: number, y: number) => number;
  }): Ghost | null {
    let nearest: Ghost | null = null;
    let minDistance = Infinity;

    const nearby = this.getNearbyEntities(thingy.x, thingy.y);

    for (const entity of nearby) {
      if (entity instanceof Ghost && entity !== thingy && !entity.inked) {
        const dist = thingy.distance(entity.x, entity.y);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = entity;
        }
      }
    }

    return nearest;
  }

  getNearbyEntities(x: number, y: number): (Pacman | Ghost)[] {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);

    const results: (Pacman | Ghost)[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        const cell = this.grid.get(key);
        if (cell) results.push(...cell);
      }
    }

    return results;
  }

  getCellKey(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }

  rebuildGrid() {
    this.grid.clear();

    const insert = (entity: Pacman | Ghost) => {
      const key = this.getCellKey(entity.x, entity.y);
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key)!.push(entity);
    };

    this.pacs.forEach(insert);
    this.ghosts.forEach(insert);
  }

  addGhost(ghost: Ghost) {
    this.ghosts.push(ghost);
  }

  addPacman(pac: Pacman) {
    this.pacs.push(pac);
  }

  run(ctx: CanvasRenderingContext2D) {
    this.rebuildGrid();

    this.pacs.forEach((pac) => pac.takeStep());
    this.ghosts.forEach((ghost) => ghost.takeStep());

    this.pacs.forEach((pac) => pac.draw(ctx));
    this.ghosts.forEach((ghost) => ghost.draw(ctx));

    this.handleBirthsAndDeaths();
  }

  handleBirthsAndDeaths() {
    this.toKill.forEach((entity) => {
      if (entity instanceof Pacman) {
        this.pacs = this.pacs.filter((p) => p !== entity);
      } else if (entity instanceof Ghost) {
        this.ghosts = this.ghosts.filter((g) => g !== entity);
      }
    });

    this.toBirth.forEach((entity) => {
      if (entity instanceof Pacman) {
        this.addPacman(entity);
      } else if (entity instanceof Ghost) {
        this.addGhost(entity);
      }
    });

    this.toKill = [];
    this.toBirth = [];
  }
}
