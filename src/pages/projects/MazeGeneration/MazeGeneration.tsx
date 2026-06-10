import { useState } from "react";
import PageContainer from "../../PageContainer";
import MazeCanvasWrapper from "./MazeCanvasWrapper";
import styles from "./MazeGeneration.module.scss";
import { Maze } from "./Maze";

const MAX_FPS = 60;
const MAX_STEPS_PER_FRAME = 40;

export default function MazeGeneration() {
  const [fps, setFPS] = useState(10);
  const [stepsPerFrame, setStepsPerFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mazeInstance, setMazeInstance] = useState<Maze>();

  return (
    <PageContainer header="Maze Generation">
      <main className={styles.main}>
        <h2>How build maze?</h2>

        <p>We got a couple options here</p>
        <p>Prim's algo or recursive backtracking</p>

        <p>
          Let's start with a maze canvas that is static, just does one thing
        </p>
        <MazeCanvasWrapper
          mazeInstance={mazeInstance}
          setMazeInstance={setMazeInstance}
          targetFPS={fps}
          stepsPerFrame={stepsPerFrame}
          isAnimating={isAnimating}
        />
        <input
          type="range"
          min={0}
          max={MAX_FPS}
          value={fps}
          id="fps-slider"
          onChange={(e) => setFPS(parseInt(e.target.value))}
        />
        {fps}
        <input
          type="range"
          min={0}
          max={MAX_STEPS_PER_FRAME}
          value={stepsPerFrame}
          id="steps-slider"
          onChange={(e) => setStepsPerFrame(parseInt(e.target.value))}
        />
        {stepsPerFrame}
        <button onClick={() => setIsAnimating((prev) => !prev)}>
          {isAnimating ? "Stop" : "Start"}
        </button>
        <button onClick={() => mazeInstance?.reset()}>Reset</button>
      </main>
    </PageContainer>
  );
}
