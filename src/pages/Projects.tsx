import ProjectCard from "../components/ProjectCard";

import LetterBoxedImgUrl from "../assets/images/letterboxed.png";
import MazePreviewImgUrl from "../assets/images/mazePreview.png";
import QubicTicTacToeImgUrl from "../assets/images/QubicTicTacToe.png";
import PacSimImgUrl from "../assets/images/pacSim.jpeg";

import MayflyImgUrl from "../assets/images/mayfly-minimal-black2.png";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { KonamiContext } from "../utils/KonamiContext";

export const PROJECT_HEADER_ID = "projects";

export default function Projects() {
  const { konamiActivated } = useContext(KonamiContext);

  return (
    <main>
      <h2 id={PROJECT_HEADER_ID}>Projects</h2>
      <div className="project-container">
        {projectList.map((proj) => (
          <ProjectCard
            key={proj.title}
            title={proj.title}
            description={proj.description}
            destinationUrl={proj.destinationUrl}
            imgUrl={proj.imgUrl}
          />
        ))}
      </div>
      {konamiActivated && (
        <div>
          <Link to="/in-progress">In Progress</Link>
        </div>
      )}
    </main>
  );
}

const projectList = [
  {
    title: "Prey Simulation",
    description:
      "A simple predator/prey environment was simulated using a turtle class and rudimentary AI. Originally implemented in Java, refreshed in JavaScript.",
    destinationUrl: "/projects/predator-prey-simulator",
    imgUrl: PacSimImgUrl,
  },
  {
    title: "Mayfly",
    description:
      "Time sheet application custom built to manage hours reporting for a small business (my parents'). It is a React app that utilizes Firebase.",
    destinationUrl: "https://github.com/asa-dillahunty/Mayfly",
    imgUrl: MayflyImgUrl,
    // imgUrl: "https://mayfly.asadillahunty.com/logo512.png",
  },
  {
    title: "Letter Boxed Solver",
    description:
      "Solution finder for the New York Times game Letter Boxed. Currently in search of an official dictionary (or just a better one that doesn't contain 'words' like \"hdkf\").",
    destinationUrl: "https://letterboxed.asadillahunty.com/",
    imgUrl: LetterBoxedImgUrl,
  },
  {
    title: "Maze Algorithms",
    description:
      "Mazes were generated using Prim's algorithm and solved via recursive backtracking.",
    destinationUrl:
      "https://asa-dillahunty.github.io/Maze-Generation-and-Solving/",
    imgUrl: MazePreviewImgUrl,
  },
  {
    title: "Qubic Tic Tac Toe",
    description:
      "3 Dimensional Tic Tac Toe with a simple 2D interface. Includes a point-based bot to play against.",
    destinationUrl: "https://asa-dillahunty.github.io/QubicTicTacToe/",
    imgUrl: QubicTicTacToeImgUrl,
  },
];
