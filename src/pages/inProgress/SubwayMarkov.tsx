import { useState, useEffect, useRef } from "react";

import MarkovMock from "../../assets/images/MarkovMock.png";

import styles from "../projects/stylesheets/ProjectPage.module.scss";
import subwayStyles from "./stylesheets/SubwayMarkov.module.scss";
import { GrPowerReset } from "react-icons/gr";

import PageContainer from "../PageContainer";

let lanes: Record<number, number>, curr: number;
function resetLanes() {
  lanes = {};
}

let markovHue = 0;

export default function SubwayMarkov() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [p, setP] = useState(1 / 3);
  const [q, setQ] = useState(1 / 3);
  const [n, setN] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [flashingColors, setFlashingColors] = useState(false);

  useEffect(() => {
    curr = Math.floor(n / 2);
  }, [n]);

  useEffect(() => {
    if (isRunning) {
      const cancelFunc = step2();
      return cancelFunc;
    }
  }, [isRunning]);

  useEffect(() => {
    if (!canvasRef?.current) return;
    canvasRef.current.width = canvasRef.current.getBoundingClientRect().width;
    canvasRef.current.height = canvasRef.current.getBoundingClientRect().height;
  }, [canvasRef]);

  function startSimulation() {
    resetLanes();
    setIsRunning(true);
  }

  function stopSimulation() {
    if (isRunning) {
      setIsRunning(false);
    } else {
      resetLanes();
      drawCanvas();
    }
  }

  function resetSimulation() {
    if (isRunning) {
      setIsRunning(false);
    }
    resetLanes();
    drawCanvas();
  }

  function step() {
    // console.log(lanes);
    const randomNum = Math.random();

    if (curr === 0) {
      if (randomNum < p) curr += 1;
    } else if (curr === n - 1) {
      if (randomNum < p) curr -= 1;
    }
    // I am a 'center lane'
    else if (randomNum < q) curr -= 1;
    else if (randomNum > 1 - q) curr += 1;

    if (!lanes[curr]) lanes[curr] = 0;
    lanes[curr] += 1;
    drawCanvas();
  }

  function step2() {
    let frameId = 0;

    function animate() {
      if (!isRunning) return;
      step();
      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }

  function drawCanvas() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barWidth = canvas.width / n;
    const maxVal = Math.max(...Object.values(lanes));

    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (flashingColors) ctx.fillStyle = getDynamicColor();
    else ctx.fillStyle = "#FF6868";

    Object.values(lanes).forEach((val, index) => {
      const barHeight = (canvas.height * val) / maxVal;
      const barStartY = canvas.height - barHeight;

      ctx.fillRect(index * barWidth, barStartY, barWidth, barHeight);
    });

    ctx.fillStyle = "#0F0F0F";
    Object.values(lanes).forEach((val, index) => {
      ctx.font = "20px Arial";
      ctx.fillText(val.toString(), index * barWidth + 5, canvas.height - 5);
    });
  }

  function getDynamicColor() {
    // not sure the best way to slow it down. This should do the trick
    if (Math.random() > 0.9) markovHue = (markovHue + 1) % 360;

    const h = markovHue;
    let c = 1;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }

  return (
    <PageContainer
      header="Simulating Subway Surfer Coin Collecting with Markov Chains"
      className={subwayStyles.header}
    >
      <main className={styles.main}>
        <section className={styles.section + " " + subwayStyles.section}>
          <p>
            One day I was playing Subway Surfers, and I couldn't help but feel
            that coins were more heavily dispersed amongst the edge rows. Now if
            you're not familiar with Subway Surfers, it's got power-ups, and the
            one I'm talking about is called a jetpack. The jetpack raises the
            player above all the obstacles and leaves the players to follow a
            path of coins. These coins transfer between the 3 lanes a player can
            run in, and one can't help but think,{" "}
            <strong>
              "If I couldn't switch lanes, which one would give me the most
              coins?"
            </strong>
          </p>

          <p>
            Are coins equally distributed across all three lanes in Subway
            Surfer? If one were to deploy a jetpack, and could only pick a
            single lane to remain in for the duration of the jetpack's fuel
            reserves, which lane would a clever man choose? What statistical
            methods might that wise woman employ to make such a determination? I
            set out seeking the source of this wisdom, and found Master Markov.
            It is his chains that guide me now through{" "}
            <strong>The Subway.</strong>
          </p>

          <p>
            Now, Markov Chains are a way to calculate probability for things
            that don't stop. Basically, one takes a representation of the
            movement between states as a matrix transformation and performs an
            integral on it, I think. I've never taken a statistics course.
          </p>

          <img src={MarkovMock} />

          <p>
            The X axis in the matrix representation above, Left (L), Center (C),
            and Right (R), are the starting positions, and the Y axis represents
            the next position. The number in each cell represents the
            probability of going from X to Y. It's clear we make a few
            assumptions here, notably that movement from the right column is
            equivalent to movement from the left column. Also one rule to follow
            the game logic, is that one cannot traverse directly from the right
            to the left column and vice versa.
          </p>

          <p>
            Taking this transformation matrix and performing the integration we
            get these three equations:
          </p>

          <div className={subwayStyles.equationContainer}>
            <math>
              <mrow>
                <mn>0.33</mn>
                <mo>(</mo>
                <mn>1</mn>
                <mo>-</mo>
                <mi>P</mi>
                <mo>)</mo>
                <mo>+</mo>
                <mn>0.33</mn>
                <mo>(</mo>
                <mi>Q</mi>
                <mo>)</mo>
              </mrow>
            </math>
            <math>
              <mrow>
                <mn>0.66</mn>
                <mo>(</mo>
                <mi>P</mi>
                <mo>)</mo>
                <mo>+</mo>
                <mn>0.33</mn>
                <mo>(</mo>
                <mn>1</mn>
                <mo>-</mo>
                <mn>2</mn>
                <mi>Q</mi>
                <mo>)</mo>
              </mrow>
            </math>
            <math>
              <mrow>
                <mn>0.33</mn>
                <mo>(</mo>
                <mn>1</mn>
                <mo>-</mo>
                <mi>P</mi>
                <mo>)</mo>
                <mo>+</mo>
                <mn>0.33</mn>
                <mo>(</mo>
                <mi>Q</mi>
                <mo>)</mo>
              </mrow>
            </math>
          </div>

          <p>
            Which underwhelmingly simplifies to{" "}
            <math>
              <mi>P</mi>
              <mo>=</mo>
              <mi>Q</mi>
            </math>
            . This means, as long as the probability of moving from an edge lane
            to the center is the same as moving from the center to an edge lane,
            the distribution should approach equal as the number of coins grows.
          </p>
        </section>
        <h2>Simulating data with set P and Q</h2>
        <p>
          By default P and Q are set as close to 1/3 as possible. N is the
          number of 'lanes' in the problem. If the number of lanes exceeds 3,
          the other 'center' lanes will be able to move left or right with a
          probability of Q, and the edge lanes will have a probability of P for
          leaving the edge.
        </p>
        <canvas ref={canvasRef} className={subwayStyles.canvas} />

        <div className={subwayStyles.buttonContainer}>
          <button className={subwayStyles.startStop} onClick={startSimulation}>
            Start
          </button>
          <button className={subwayStyles.startStop} onClick={stopSimulation}>
            Stop
          </button>

          <button className={subwayStyles.startStop} onClick={resetSimulation}>
            <GrPowerReset />
          </button>
        </div>
        <div className="variable-inputs">
          <div>
            <label>
              P:{" "}
              <input
                type="number"
                value={p}
                onChange={(e) => setP(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Q:{" "}
              <input
                type="number"
                value={q}
                onChange={(e) => setQ(parseFloat(e.target.value))}
              />
            </label>
            <label>
              N:{" "}
              <input
                type="number"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
              />
            </label>
          </div>

          <label>
            <input
              type="checkbox"
              checked={flashingColors}
              onChange={(e) => setFlashingColors(e.target.checked)}
            />{" "}
            Flashing Colors
          </label>
        </div>
      </main>
    </PageContainer>
  );
}
