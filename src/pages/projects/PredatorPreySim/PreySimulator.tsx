import React, { useRef, useEffect, useState, useContext } from "react";
import styles from "./stylesheets/PreySimulator.module.scss";
import pacManImg from "../../../assets/images/pacman.png";
import ghostImg from "../../../assets/images/Ghost.png";
import Footer from "../../../components/Footer";
import Navigation from "../../../components/Navigation";
import { FaAngleDoubleDown } from "react-icons/fa";
import { KonamiContext } from "../../../utils/KonamiContext";
import { Arcade } from "./Arcade";
import { Ghost } from "./Ghost";
import { Pacman } from "./Pacman";

// --- React Component ---

const PreySimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentIntervalRef = useRef<number | null>(null);
  const arcadeRef = useRef<Arcade | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { konamiActivated } = useContext(KonamiContext);

  // Start the game loop at a given FPS
  const startGameLoop = (fps: number, ctx: CanvasRenderingContext2D) => {
    if (currentIntervalRef.current) clearInterval(currentIntervalRef.current);
    const interval = konamiActivated ? 0 : 1000 / fps;
    currentIntervalRef.current = window.setInterval(
      () => gameLoop(ctx),
      interval,
    );
  };

  // Main game loop: clear the canvas, run the simulation, and check for termination.
  const gameLoop = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (arcadeRef.current) {
      arcadeRef.current.run(ctx);
      if (
        arcadeRef.current.pacs.length < 1 ||
        arcadeRef.current.ghosts.length < 1
      ) {
        if (currentIntervalRef.current) {
          stopSim();
          startSim();
        }
      }
    }
  };

  // Initialize the simulation, set canvas dimensions, and add initial entities.
  const initSim = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const spriteSize = Math.sqrt((canvas.width * canvas.height) / 4000);

    if (currentIntervalRef.current) clearInterval(currentIntervalRef.current);
    arcadeRef.current = new Arcade(canvas.width, canvas.height, spriteSize);

    const startingPacman = Math.ceil(350 / spriteSize);
    const startingGhosts = startingPacman * 12;

    // Add initial Pacman and Ghost entities
    for (let i = 0; i < startingPacman; i++) {
      arcadeRef.current.addPacman(
        new Pacman(
          arcadeRef.current,
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          spriteSize,
        ),
      );
    }
    for (let i = 0; i < startingGhosts; i++) {
      arcadeRef.current.addGhost(
        new Ghost(
          arcadeRef.current,
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          spriteSize,
        ),
      );
    }
    startGameLoop(30, ctx);
  };

  // Starts the simulation and makes the simulation wrapper visible.
  const startSim = () => {
    initSim();
  };

  // Stops the simulation and hides the simulation wrapper.
  const stopSim = () => {
    if (currentIntervalRef.current) {
      clearInterval(currentIntervalRef.current);
    }
  };

  const handleScroll = () => {
    if (hasScrolled) return;
    setHasScrolled(true);
    window.removeEventListener("scroll", handleScroll);
  };

  useEffect(() => {
    startSim();
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (currentIntervalRef.current) {
        clearInterval(currentIntervalRef.current);
      }
      if (!hasScrolled) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (konamiActivated) {
      // restart the sim
      stopSim();
      startSim();
    }
  }, [konamiActivated]);

  return (
    <>
      <header className={styles.header}>
        <Navigation />
        <h1 className={styles.h1}>Predator/Prey Simulation</h1>
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          className={styles.gameCanvas}
        ></canvas>
      </header>

      <main className={styles.main}>
        <FaAngleDoubleDown
          className={hasScrolled ? styles.noScrollHint : styles.scrollHint}
        />
        <h2>Premise</h2>
        <p>
          Create a simple environment with predators and prey who eat and breed.
          Both predators and prey reproduce asexually, and it is assumed prey
          have an infinite food source. However, predators can starve if they go
          too long without eating. Classic, nostalgic characters were chosen to
          represent the predators and prey.
        </p>
        <ul className={styles.exampleImages}>
          <li>
            <figure>
              <img src={pacManImg} alt="PacMan" id="PacMan" />
              <figcaption>Predator</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={ghostImg} alt="Blue Ghost" id="Ghost" />
              <figcaption>Prey</figcaption>
            </figure>
          </li>
        </ul>
        <p>
          To implement this environment, a turtle class was provided by the
          instructor. With the sprites changed and giving each character a very
          basic AI, the simulation tends to run fairly smooth. The beginning
          does rely on random placement and amount, so being unlucky can cause
          early termination of the program. In the back of the canvas, the
          population of predators and prey are graphed.
        </p>
        <iframe
          src="https://www.youtube.com/embed/XTaMS7FTO78"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        ></iframe>
      </main>
      <Footer />
    </>
  );
};

export default PreySimulator;
