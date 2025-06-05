import { useContext, useEffect, useRef } from "react";
import styles from "./stylesheets/GhostBackground.module.scss";
import ghostImage from "../assets/images/ghostFullSprite.png";

import { ThemeContext, ThemeContextType } from "../utils/ThemeContext";

let animationFrame: number = 0;
export default function GhostBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { staticColors: colors } = useContext<ThemeContextType>(ThemeContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const ghost = new Ghost(canvas, width / 2, height / 2, 3);

    function step() {
      if (!ctx || !colors) return;

      ctx.clearRect(0, 0, width, height);
      ghost.takeStep();
      ghost.draw(ctx);

      animationFrame = requestAnimationFrame(step);
    }

    step();

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeHandler);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [colors]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

class Ghost {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  step: number;
  frameCount: number;
  size: number;
  speed: number;
  direction: number;

  spriteWidth = 32;
  spriteHeight = 32;
  frameArray = [0, 1];
  frameIndex = 0;
  img = new Image();

  constructor(canvas: HTMLCanvasElement, x: number, y: number, size: number) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.step = 0;
    this.frameCount = 0;
    this.size = size;
    this.speed = 1;
    this.direction = Math.random() * 360;
    this.img.src = ghostImage;

    this.randomizeMovement();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
    let dy = 32;
    if (this.direction > 270 || this.direction < 90) {
      dy = 0;
    }

    ctx.drawImage(
      this.img,
      this.spriteWidth * this.frameArray[this.frameIndex],
      dy,
      this.spriteWidth - 1,
      this.spriteHeight - 1,
      this.x,
      this.y,
      this.spriteWidth * this.size,
      this.spriteHeight * this.size
    );
  }

  randomizeMovement() {
    if (Math.random() > 0.15) {
      this.speed = 1;
    } else {
      this.speed = 0;
    }
    // this.speed = Math.floor(this.maxSpeed * Math.random());
    this.direction = Math.random() * 360;
    this.step = Math.floor(180 * Math.random() + 360);
  }

  takeStep() {
    this.step--;
    this.frameCount++;

    if (this.step < 0) {
      this.randomizeMovement();
    }

    if (this.frameCount > 60) {
      this.frameCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameArray.length;
    }

    this.moveForward();
  }

  moveForward() {
    this.x += Math.cos((this.direction * Math.PI) / 180) * this.speed;
    this.y += Math.sin((this.direction * Math.PI) / 180) * this.speed;

    if (this.x < 0) {
      this.x = 0;
      this.direction = (180 - this.direction) % 360;
    } else if (this.x + this.spriteWidth * this.size > this.canvas.width) {
      this.x = this.canvas.width - this.spriteWidth * this.size;
      this.direction = (540 - this.direction) % 360;
    }

    if (this.y < 0) {
      this.y = 0;
      this.direction = (360 - this.direction) % 360;
    } else if (this.y + this.spriteHeight * this.size > this.canvas.height) {
      this.y = this.canvas.height - this.spriteHeight * this.size;
      this.direction = (360 - this.direction) % 360;
    }
  }
}
