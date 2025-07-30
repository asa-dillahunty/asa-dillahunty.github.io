import React, { useRef, useEffect, useCallback } from "react";

// Shared across all renders
const audioCtx = new (window.AudioContext ||
  (window as any).webkitAudioContext)();

const BouncingBall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const radiusRef = useRef(10);
  const velocityRef = useRef({ x: 2, y: 2 });
  const positionRef = useRef({ x: 0, y: 0 });

  const playBounceSound = () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume(); // Ensure it’s active after user interaction
    }

    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      300 + Math.random() * 100,
      audioCtx.currentTime
    );

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  };

  const width = 400;
  const height = 400;
  const circleRadius = 150;
  const center = { x: width / 2, y: height / 2 };

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const draw = () => {
      const pos = positionRef.current;
      const vel = velocityRef.current;
      let radius = radiusRef.current;

      ctx.clearRect(0, 0, width, height);

      // Draw bounding circle
      ctx.beginPath();
      ctx.arc(center.x, center.y, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update position
      pos.x += vel.x;
      pos.y += vel.y;

      // Vector from center to ball
      const dx = pos.x - center.x;
      const dy = pos.y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance + radius >= circleRadius) {
        // Normalize the direction vector
        const norm = { x: dx / distance, y: dy / distance };

        // Project velocity onto normal
        const dot = vel.x * norm.x + vel.y * norm.y;

        // Reflect the velocity
        vel.x -= 2 * dot * norm.x;
        vel.y -= 2 * dot * norm.y;

        // Move the ball slightly inside the circle
        pos.x = center.x + (circleRadius - radius - 1) * norm.x;
        pos.y = center.y + (circleRadius - radius - 1) * norm.y;

        playBounceSound();

        // Grow the ball
        radiusRef.current += 2;
        // radiusRef.current += Math.ceil(80 / radiusRef.current) / 2;

        if (radiusRef.current + 1 >= circleRadius) {
          return;
        }
      }

      // Draw ball
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#66ccff";
      ctx.fill();
      ctx.strokeStyle = "#3399cc";
      ctx.lineWidth = 2;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Reset state
    radiusRef.current = 10;
    velocityRef.current = { x: 2, y: 2 };
    positionRef.current = { x: center.x + 50, y: center.y };

    startAnimation();
  };

  useEffect(() => {
    reset(); // start animation initially

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startAnimation]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <canvas ref={canvasRef} style={{ border: "1px solid #ddd" }} />
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Reset
      </button>
    </div>
  );
};

export default BouncingBall;
