import React, { useRef, useEffect, useState } from "react";
import styles from "./stylesheets/PreySimulator.module.scss";
import pacManImg from "../../assets/images/pacman.png";
import ghostImg from "../../assets/images/Ghost.png";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import { FaAngleDoubleDown } from "react-icons/fa";

// --- Simulation Classes (converted to TypeScript) ---

class Pacman {
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
    if (this.arcade.pacs.length < 8) {
      this.food--;
    } else {
      this.food -= 4;
    }
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

const Ghost_Colors = ["lightblue", "red", "orange", "pink"];

class Ghost {
  arcade: Arcade;
  x: number;
  y: number;
  mate: number;
  size: number;
  speed: number;
  count: number;
  inked: boolean;
  direction: number;
  color: string;

  constructor(arcade: Arcade, x: number, y: number, size: number) {
    this.arcade = arcade;
    this.x = x;
    this.y = y;
    this.mate = Math.floor(Math.random() * 35);
    this.size = size;
    this.speed = size / 8;
    this.count = 0;
    this.inked = false;
    this.direction = Math.random() * 360;
    this.color = Ghost_Colors[Math.floor(Math.random() * Ghost_Colors.length)];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Main body (top half)
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, Math.PI, 0, false);
    ctx.lineTo(this.size / 2, this.size / 2);

    // Squiggles at the bottom
    const squiggleCount = 5;
    const squiggleWidth = this.size / squiggleCount;
    const squiggleHeight = this.size / 8;
    for (let i = 0; i < squiggleCount; i++) {
      ctx.quadraticCurveTo(
        this.size / 2 - squiggleWidth * (i + 0.5),
        this.size / 2 + squiggleHeight * (i % 2 === 0 ? 1 : -1),
        this.size / 2 - squiggleWidth * (i + 1),
        this.size / 2
      );
    }
    ctx.lineTo(-this.size / 2, this.size / 2);
    ctx.closePath();
    ctx.fillStyle = this.inked ? "darkblue" : this.color;
    ctx.fill();

    // Eyes
    const eyeWidth = this.size / 8;
    const eyeHeight = this.size / 5;
    const eyeOffsetX = this.size / 5;
    const eyeOffsetY = 0;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(
      -eyeOffsetX,
      -eyeOffsetY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      2 * Math.PI
    );
    ctx.ellipse(
      eyeOffsetX,
      -eyeOffsetY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();

    ctx.fillStyle = "black";
    const pupilSize = eyeWidth / 2;
    ctx.beginPath();
    ctx.ellipse(
      -eyeOffsetX + pupilSize,
      -eyeOffsetY,
      pupilSize,
      pupilSize,
      0,
      0,
      2 * Math.PI
    );
    ctx.ellipse(
      eyeOffsetX + pupilSize,
      -eyeOffsetY,
      pupilSize,
      pupilSize,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();

    ctx.restore();
  }

  takeStep() {
    if (this.inked) {
      this.mate += 2;
    } else {
      this.mate++;
    }
    this.count--;

    if (this.mate > 80) {
      const ghosty = new Ghost(this.arcade, this.x, this.y, this.size);
      ghosty.x += Math.cos((this.direction * Math.PI) / 180) * this.size;
      ghosty.y += Math.sin((this.direction * Math.PI) / 180) * this.size;
      this.arcade.toBirth.push(ghosty);
      this.mate = 0;
    }

    let nearestPac = this.arcade.nearestPac(this);
    if (nearestPac) {
      let distance = this.distance(nearestPac.x, nearestPac.y);
      if (distance < this.size * 4) {
        this.direction = this.towards(nearestPac.x, nearestPac.y) + 180;
      }
    }

    let nearestGhost = this.arcade.nearestGhost(this);
    if (nearestGhost && nearestGhost !== this) {
      let distance = this.distance(nearestGhost.x, nearestGhost.y);
      if (distance < this.size) {
        this.direction = this.towards(nearestGhost.x, nearestGhost.y) + 180;
      }
    } else if (!this.inked) {
      this.inkself();
    }

    if (this.count === 0) {
      this.unInk();
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

  inkself() {
    this.inked = true;
    this.count = 100;
  }

  unInk() {
    this.inked = false;
  }
}

class Arcade {
  ghosts: Ghost[];
  pacs: Pacman[];
  toKill: (Ghost | Pacman)[];
  toBirth: (Ghost | Pacman)[];
  width: number;
  height: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.ghosts = [];
    this.pacs = [];
    this.toKill = [];
    this.toBirth = [];
    this.width = canvasWidth;
    this.height = canvasHeight;
  }

  nearestPac(thingy: {
    x: number;
    y: number;
    distance: (x: number, y: number) => number;
  }): Pacman | null {
    let nearest: Pacman | null = null;
    let minDistance = Infinity;
    this.pacs.forEach((pac) => {
      if (pac !== thingy) {
        let dist = thingy.distance(pac.x, pac.y);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = pac;
        }
      }
    });
    return nearest;
  }

  nearestGhost(thingy: {
    x: number;
    y: number;
    distance: (x: number, y: number) => number;
  }): Ghost | null {
    let nearest: Ghost | null = null;
    let minDistance = Infinity;
    this.ghosts.forEach((ghost) => {
      if (ghost !== thingy && !ghost.inked) {
        let dist = thingy.distance(ghost.x, ghost.y);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = ghost;
        }
      }
    });
    return nearest;
  }

  addGhost(ghost: Ghost) {
    this.ghosts.push(ghost);
  }

  addPacman(pac: Pacman) {
    this.pacs.push(pac);
  }

  run(ctx: CanvasRenderingContext2D) {
    this.pacs.forEach((pac) => pac.takeStep());
    this.ghosts.forEach((ghost) => ghost.takeStep());

    this.pacs.forEach((pac) => pac.draw(ctx));
    this.ghosts.forEach((ghost) => ghost.draw(ctx));

    this.handleBirthsAndDeaths();
  }

  handleBirthsAndDeaths() {
    this.toKill.forEach((entity) => {
      if (entity instanceof Pacman) {
        this.pacs = this.pacs.filter((p) => p !== entity);
      } else if (entity instanceof Ghost) {
        this.ghosts = this.ghosts.filter((g) => g !== entity);
      }
    });

    this.toBirth.forEach((entity) => {
      if (entity instanceof Pacman) {
        this.addPacman(entity);
      } else if (entity instanceof Ghost) {
        this.addGhost(entity);
      }
    });

    this.toKill = [];
    this.toBirth = [];
  }
}

// --- React Component ---

const PreySimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentIntervalRef = useRef<number | null>(null);
  const arcadeRef = useRef<Arcade | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Start the game loop at a given FPS
  const startGameLoop = (fps: number, ctx: CanvasRenderingContext2D) => {
    if (currentIntervalRef.current) clearInterval(currentIntervalRef.current);
    const interval = 1000 / fps;
    currentIntervalRef.current = window.setInterval(
      () => gameLoop(ctx),
      interval
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

    if (currentIntervalRef.current) clearInterval(currentIntervalRef.current);
    arcadeRef.current = new Arcade(canvas.width, canvas.height);

    const spriteSize = Math.sqrt((canvas.width * canvas.height) / 400);

    // Add initial Pacman and Ghost entities
    for (let i = 0; i < 8; i++) {
      arcadeRef.current.addPacman(
        new Pacman(
          arcadeRef.current,
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          spriteSize
        )
      );
    }
    for (let i = 0; i < 100; i++) {
      arcadeRef.current.addGhost(
        new Ghost(
          arcadeRef.current,
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          spriteSize
        )
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
