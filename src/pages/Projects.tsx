import ProjectCard from "../components/ProjectCard";

import LetterBoxedImgUrl from "../assets/images/letterboxed.png";
import MazePreviewImgUrl from "../assets/images/mazePreview.png";
import QubicTicTacToeImgUrl from "../assets/images/QubicTicTacToe.png";
import BombGameImgUrl from "../assets/images/bombGame.png";
import MarsCitiesImgUrl from "../assets/images/marsCities.png";
import PacSimImgUrl from "../assets/images/pacSim.png";
import AsciiImgUrl from "../assets/images/phant.png";

import MayflyImgUrl from "../assets/images/mayfly-minimal-black2.png";

import { Link } from "react-router-dom";
import PageContainer from "./PageContainer";
import StaticBackground from "../components/StaticBackground";
import { useContext } from "react";
import { KonamiContext } from "../utils/KonamiContext";

export default function Projects() {
  const { konamiActivated } = useContext(KonamiContext);
  return (
    <PageContainer header="Projects">
      <main>
        <StaticBackground />
        {/* <h2 id="projects">Projects</h2> */}
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
    </PageContainer>
  );
}

const projectList = [
  {
    title: "Mayfly",
    description:
      "Time sheet application custom built to manage hours reporting on a farm (my parents). It is a React app that utilizes Firebase.",
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
  {
    title: "Prey Simulation",
    description:
      "A simple predator/prey environment was simulated using a turtle class and rudimentary AI.",
    destinationUrl: "/projects/predator-prey-simulator",
    imgUrl: PacSimImgUrl,
  },
  {
    title: "Capture the Flag",
    description:
      "Simple AI's were created to play capture the flag on a 2D plane.",
    destinationUrl: "/projects/capture-the-flag",
    imgUrl: BombGameImgUrl,
  },
  {
    title: "Path Finding",
    description:
      "Cities were built on a terrain map, and then connected using Dijkstra's algorithm.",
    destinationUrl: "/projects/mars-paths",
    imgUrl: MarsCitiesImgUrl,
  },
  {
    title: "ASCII It!",
    description:
      "This program was written for Crimson Hacks. It converts images compatible with JAVA's BufferedImage class into ASCII representations.",
    destinationUrl: "/projects/ascii-art",
    imgUrl: AsciiImgUrl,
  },
];
