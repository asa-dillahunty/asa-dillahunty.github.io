import { Arcade } from "./Arcade";

export class Pacman {
  arcade: Arcade;
  x: number;
  y: number;
  food: number;
  mate: number;
  step: number;
  size: number;
  open: boolean;
  speed: number;
  direction: number;
  mouthOpenAngle: number;
  mouthCloseAngle: number;
  mouthAngle: number;
  mouthDirection: number;

  constructor(arcade: Arcade, x: number, y: number, size: number) {
    this.arcade = arcade;
    this.x = x;
    this.y = y;
    this.food = 100;
    this.mate = 0;
    this.step = Math.floor(Math.random() * 4);
    this.size = size;
    this.open = true;
    this.speed = Math.floor(size / 5);
    this.direction = Math.random() * 360;

    // Animation properties
    this.mouthOpenAngle = 0.5 * Math.PI;
    this.mouthCloseAngle = 0;
    this.mouthAngle = this.mouthOpenAngle;
    this.mouthDirection = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    const startAngle = (this.direction * Math.PI) / 180 + this.mouthAngle / 2;
    const endAngle = (this.direction * Math.PI) / 180 - this.mouthAngle / 2;

    // If mouth is fully closed, draw a full circle
    if (this.mouthAngle <= 0.01 * Math.PI) {
      ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
    } else {
      ctx.arc(this.x, this.y, this.size / 2, startAngle, endAngle, false);
      ctx.lineTo(this.x, this.y);
    }

    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    this.animateMouth();
  }

  animateMouth() {
    if (this.mouthDirection === 1) {
      this.mouthAngle -= 0.1 * Math.PI;
      if (this.mouthAngle <= this.mouthCloseAngle) {
        this.mouthDirection = -1;
      }
    } else {
      this.mouthAngle += 0.1 * Math.PI;
      if (this.mouthAngle >= this.mouthOpenAngle) {
        this.mouthDirection = 1;
      }
    }
  }

  takeStep() {
    // if (this.arcade.pacs.length < 8) {
    //   this.food--;
    // } else {
    //   this.food -= 4;
    // }
    this.food--;
    this.step++;

    if (this.food < 0) {
      this.arcade.toKill.push(this);
      return;
    }

    let nearestGhost = this.arcade.nearestGhost(this);
    if (nearestGhost) {
      let distance = this.distance(nearestGhost.x, nearestGhost.y);
      if (distance < this.size && !this.arcade.toKill.includes(nearestGhost)) {
        this.food += 40;
        this.arcade.toKill.push(nearestGhost);
      } else if (distance < this.size * 3) {
        this.direction = this.towards(nearestGhost.x, nearestGhost.y);
      }
    }

    let nearestPac = this.arcade.nearestPac(this);
    if (nearestPac && nearestPac !== this) {
      let distance = this.distance(nearestPac.x, nearestPac.y);
      if (distance < this.size + 5) {
        this.direction = this.towards(nearestPac.x, nearestPac.y) - 180;
      }
    }

    if (this.food > 1500) {
      this.food -= 1100;
      let newPacman = new Pacman(this.arcade, this.x, this.y, this.size);
      newPacman.x += Math.cos((this.direction * Math.PI) / 180) * this.size;
      newPacman.y += Math.sin((this.direction * Math.PI) / 180) * this.size;
      this.arcade.toBirth.push(newPacman);
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
}
