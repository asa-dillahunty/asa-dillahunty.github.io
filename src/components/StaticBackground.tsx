import { useContext, useEffect, useRef } from "react";
import styles from "./stylesheets/StaticBackground.module.scss";
import { ThemeContext, ThemeContextType } from "../utils/ThemeContext";

let animationFrame: number = 0;
export default function StaticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { staticColors: colors } = useContext<ThemeContextType>(ThemeContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // const totalParticles = 750;
    const noiseDensity = 1; // Adjust for more/less noise
    const totalParticles = width * height * noiseDensity * 0.001;
    const particleSize = 5; // Size of noise dots
    const speed = 1; // How fast particles move down
    const baseSpeed = 0.5;

    let particles: {
      x: number;
      y: number;
      opacity: number;
      speed: number;
      drift: number;
    }[] = [];

    function initParticles() {
      for (let i = 0; i < totalParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          opacity: Math.random() * 0.4 + 0.1,
          // opacity: Math.random() * 0.5 + 0.2,
          speed: Math.random() * speed + baseSpeed,
          drift: (Math.random() - 0.5) / 2,
        });
      }
    }

    const pi2 = 2 * Math.PI;
    function draw() {
      if (!ctx || !colors) return;
      ctx.fillStyle = colors.bg;
      // ctx.fillStyle = "rgb(0, 0, 0)";
      //   ctx.fillStyle = "#16142a22";
      ctx.fillRect(0, 0, width, height);
      const tailLength = 10;

      for (const p of particles) {
        // ctx.fillStyle = `rgba(111, 103, 255, ${p.opacity})`;
        // ctx.fillStyle = `rgba(255, 150, 0, ${p.opacity})`;
        ctx.fillStyle = `rgba(53, 48, 99, ${p.opacity})`;
        // ctx.fillStyle = `rgba(111, 103, 255, ${p.opacity})`;

        // switching fill style is slow - group by color
        for (let i = tailLength; i > 0; i--) {
          // ctx.fillStyle = `rgba(111, 103, 255, ${p.opacity / i})`;
          ctx.fillStyle = `${colors.primary}${Math.ceil((p.opacity / i) * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fillRect(
            p.x,
            p.y + (tailLength - i) * particleSize,
            particleSize,
            particleSize
          );
        }

        // ctx.beginPath();
        // ctx.ellipse(p.x, p.y, particleSize, particleSize, 0, 0, pi2);
        // ctx.fill();
        // ctx.fillRect(p.x, p.y, particleSize, particleSize);
        // p.y += p.drift;
        // p.x += p.speed;
        p.y += p.speed;
        p.x += p.drift;

        if (p.y > height) {
          p.y = 0 - tailLength * particleSize;
          p.x = Math.random() * width;
        }
        // if (p.x > width) {
        //   p.x = 0;
        //   p.y = Math.random() * height;
        // }
      }

      animationFrame = requestAnimationFrame(draw);
    }

    initParticles();
    draw();

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      initParticles();
    };

    window.addEventListener("resize", resizeHandler);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [colors]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
