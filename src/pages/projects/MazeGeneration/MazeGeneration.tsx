import { useState } from "react";
import PageContainer from "../../PageContainer";
import MazeCanvasWrapper from "./MazeCanvasWrapper";
import styles from "./MazeGeneration.module.scss";
import { Maze } from "./Maze";
import { SolveBehavior } from "./SolveBehaviors";
import { BuildBehavior } from "./BuildBehaviors";

const MAX_FPS = 60;
const MAX_STEPS_PER_FRAME = 40;

const solveBehaviorsMap = {
  "A*": {
    algoLabel: "A*",
    behavior: () => {},
  },
  "Recursive Backtracking": {
    algoLabel: "Recursive Backtracking",
    behavior: () => {},
  },
};

const buildBehaviorsMap = {
  "Prim's": {
    algoLabel: "Prim's",
    behavior: () => {},
  },
  "Recursive Backtracking": {
    algoLabel: "Recursive Backtracking",
    behavior: () => {},
  },
};

export default function MazeGeneration() {
  const [fps, setFPS] = useState(10);
  const [stepsPerFrame, setStepsPerFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mazeInstance, setMazeInstance] = useState<Maze>();

  const [buildBehavior, setBuildBehavior] = useState<BuildBehavior>(
    Object.values(buildBehaviorsMap)[0].behavior,
  );
  const [solveBehavior, setSolveBehavior] = useState<SolveBehavior>(
    Object.values(solveBehaviorsMap)[0].behavior,
  );

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

        <label htmlFor="build-select">chose a build behavior</label>
        <select
          name="build-behavior"
          id="build-select"
          onChange={(e) => {
            setSolveBehavior(buildBehaviorsMap[e.target.value].behavior);
          }}
        >
          {Object.values(buildBehaviorsMap).map((val) => (
            <option value={val.algoLabel} key={val.algoLabel + "-build"}>
              {val.algoLabel}
            </option>
          ))}
        </select>

        <label htmlFor="solve-select">chose a solve behavior</label>
        <select
          name="solve-behavior"
          id="solve-select"
          onChange={(e) => {
            setSolveBehavior(solveBehaviorsMap[e.target.value].behavior);
          }}
        >
          {Object.values(solveBehaviorsMap).map((val) => (
            <option value={val.algoLabel} key={val.algoLabel + "-solve"}>
              {val.algoLabel}
            </option>
          ))}
        </select>
      </main>
    </PageContainer>
  );
}
