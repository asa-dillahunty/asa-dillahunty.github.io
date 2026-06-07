import { useContext, useEffect, useRef, useState } from "react";
import styles from "./stylesheets/MazeCanvas.module.scss";

import { ThemeContext } from "../utils/ThemeContext";
import { Maze } from "../pages/projects/MazeGeneration/Maze";

// const TARGET_FPS = 20;
const TARGET_FPS = 60;
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
