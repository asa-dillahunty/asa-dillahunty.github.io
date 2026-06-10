import { useContext, useEffect, useRef, useState } from "react";
import { KonamiContext } from "../../../utils/KonamiContext";
import styles from "./MazeGeneration.module.scss";
import { BuildBehavior } from "./BuildBehaviors";
import { SolveBehavior } from "./SolveBehaviors";
import { Maze } from "./Maze";
import { ThemeContext } from "../../../utils/ThemeContext";

type MazeCanvasWrapperProps = {
  mazeInstance?: Maze;
  setMazeInstance: (maze?: Maze) => void; // TODO: update to be actual state type

  targetFPS: number;
  stepsPerFrame: number;
  isAnimating: boolean;

  buildBehavior: BuildBehavior;
  solveBehavior: SolveBehavior;
};

export default function MazeCanvasWrapper({
  mazeInstance,
  setMazeInstance,
  targetFPS,
  stepsPerFrame,
  isAnimating,
}: MazeCanvasWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [mazeProps, setMazeProps] = useState({ width: 0, height: 0 });
  const { konamiActivated } = useContext(KonamiContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cancelAnimationRef = useRef<() => void>(() => {});
  const { mazeColors } = useContext(ThemeContext);

  // this use effect starts the animation
  useEffect(() => {
    if (!mazeInstance) return;

    const isCancelled = () => !isAnimating;
    cancelAnimationRef.current = step(
      mazeInstance,
      isCancelled,
      targetFPS,
      stepsPerFrame,
    );

    return () => {
      cancelAnimationRef.current();
    };
  }, [isAnimating, mazeInstance]);

  // this use effect initializes the maze and canvas
  useEffect(() => {
    if (!mazeProps?.height || !mazeProps?.width || !mazeColors) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = mazeProps.width;
    canvas.height = mazeProps.height;

    const mazeInstance = new Maze(canvas, mazeProps, mazeColors);
    setMazeInstance(mazeInstance);
  }, [mazeProps, canvasRef]);

  useEffect(() => {
    if (mazeColors && mazeInstance) {
      mazeInstance?.setColors(mazeColors);
      // mazeInstance.render();
    }
  }, [mazeColors]);

  useEffect(() => {
    if (wrapperRef?.current) {
      setMazeProps({
        width: wrapperRef.current.clientWidth,
        height: wrapperRef.current.clientHeight,
      });
    }
  }, [wrapperRef]);

  if (!mazeProps?.height || !mazeProps?.width) {
    <div ref={wrapperRef} className={styles.wrapper}>
      <canvas className={styles.hidden} ref={canvasRef}></canvas>
    </div>;
  }
  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </div>
  );
}

function step(
  maze: Maze,
  isCancelled: () => boolean,
  targetFPS: number,
  stepsPerFrame: number,
) {
  let lastTime = 0;
  const fpsInterval = 1000 / targetFPS;
  let frameId = 0;

  function animate(time: number) {
    if (isCancelled()) return;

    if (time - lastTime >= fpsInterval) {
      lastTime = time;
      for (let i = 0; i < stepsPerFrame; i++) {
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
