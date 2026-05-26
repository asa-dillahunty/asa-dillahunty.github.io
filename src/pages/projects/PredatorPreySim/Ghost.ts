import { Arcade } from "./Arcade";

const Ghost_Colors = ["lightblue", "red", "orange", "pink"];

export class Ghost {
  arcade: Arcade;
  x: number;
  y: number;
  mate: number;
  size: number;
  speed: number;
  count: number;
  inked: boolean;
  direction: number;
  color: string;

  constructor(arcade: Arcade, x: number, y: number, size: number) {
    this.arcade = arcade;
    this.x = x;
    this.y = y;
    this.mate = Math.floor(Math.random() * 35);
    this.size = size;
    this.speed = size / 8;
    this.count = 0;
    this.inked = false;
    this.direction = Math.random() * 360;
    this.color = Ghost_Colors[Math.floor(Math.random() * Ghost_Colors.length)];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Main body (top half)
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, Math.PI, 0, false);
    ctx.lineTo(this.size / 2, this.size / 2);

    // Squiggles at the bottom
    const squiggleCount = 5;
    const squiggleWidth = this.size / squiggleCount;
    const squiggleHeight = this.size / 8;
    for (let i = 0; i < squiggleCount; i++) {
      ctx.quadraticCurveTo(
        this.size / 2 - squiggleWidth * (i + 0.5),
        this.size / 2 + squiggleHeight * (i % 2 === 0 ? 1 : -1),
        this.size / 2 - squiggleWidth * (i + 1),
        this.size / 2,
      );
    }
    ctx.lineTo(-this.size / 2, this.size / 2);
    ctx.closePath();
    ctx.fillStyle = this.inked ? "darkblue" : this.color;
    ctx.fill();

    // Eyes
    const eyeWidth = this.size / 8;
    const eyeHeight = this.size / 5;
    const eyeOffsetX = this.size / 5;
    const eyeOffsetY = 0;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(
      -eyeOffsetX,
      -eyeOffsetY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      2 * Math.PI,
    );
    ctx.ellipse(
      eyeOffsetX,
      -eyeOffsetY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    ctx.fillStyle = "black";
    const pupilSize = eyeWidth / 2;
    ctx.beginPath();
    ctx.ellipse(
      -eyeOffsetX + pupilSize,
      -eyeOffsetY,
      pupilSize,
      pupilSize,
      0,
      0,
      2 * Math.PI,
    );
    ctx.ellipse(
      eyeOffsetX + pupilSize,
      -eyeOffsetY,
      pupilSize,
      pupilSize,
      0,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    ctx.restore();
  }

  takeStep() {
    if (this.inked) {
      this.mate += 2;
      this.count--;
    } else {
      this.mate++;
    }

    if (this.mate > 80) {
      const ghosty = new Ghost(this.arcade, this.x, this.y, this.size);
      ghosty.x += Math.cos((this.direction * Math.PI) / 180) * this.size;
      ghosty.y += Math.sin((this.direction * Math.PI) / 180) * this.size;
      this.arcade.toBirth.push(ghosty);
      this.mate = 0;
    }

    let nearestPac = this.arcade.nearestPac(this);
    if (nearestPac) {
      let distance = this.distance(nearestPac.x, nearestPac.y);
      if (distance < this.size * 4) {
        this.direction = this.towards(nearestPac.x, nearestPac.y) + 180;
      }
    }

    let nearestGhost = this.arcade.nearestGhost(this);
    if (nearestGhost && nearestGhost !== this) {
      let distance = this.distance(nearestGhost.x, nearestGhost.y);
      if (distance < this.size) {
        this.direction = this.towards(nearestGhost.x, nearestGhost.y) + 180;
      }
    } else if (this.arcade.ghosts.length === 1 && !this.inked) {
      this.inkSelf();
    }

    if (this.count === 0) {
      this.unInk();
    }

    this.moveForward();
  }

  moveForward() {
    this.x += Math.cos((this.direction * Math.PI) / 180) * this.speed;
    this.y += Math.sin((this.direction * Math.PI) / 180) * this.speed;

    if (this.x < 0) {
      this.x = 0;
      this.direction = (180 - this.direction) % 360;
    } else if (this.x > this.arcade.width) {
      this.x = this.arcade.width;
      this.direction = (180 - this.direction) % 360;
    }

    if (this.y < 0) {
      this.y = 0;
      this.direction = (360 - this.direction) % 360;
    } else if (this.y > this.arcade.height) {
      this.y = this.arcade.height;
      this.direction = (360 - this.direction) % 360;
    }
  }

  distance(x: number, y: number): number {
    return Math.hypot(this.x - x, this.y - y);
  }

  towards(x: number, y: number): number {
    return (Math.atan2(y - this.y, x - this.x) * 180) / Math.PI;
  }

  inkSelf() {
    this.inked = true;
    this.count = 100;
  }

  unInk() {
    this.inked = false;
  }
}
