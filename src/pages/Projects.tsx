import ProjectCard, {
  ProjectCardProps,
  ProjectTechnology,
} from "../components/ProjectCard";

import LetterBoxedImgUrl from "../assets/images/letterboxed.png";
import MazePreviewImgUrl from "../assets/images/mazePreview.png";
import QubicTicTacToeImgUrl from "../assets/images/QubicTicTacToe.png";
import PacSimImgUrl from "../assets/images/pacSim.jpeg";

import MayflyImgUrl from "../assets/images/mayfly-minimal-black2.png";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { KonamiContext } from "../utils/KonamiContext";
import GhostBackground from "../components/GhostBackground";

import styles from "./stylesheets/Projects.module.scss";
import { SiFirebase } from "react-icons/si";
import {
  TbBrandFirebase,
  TbBrandJavascript,
  TbBrandSpotify,
  TbBrandTypescript,
} from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import { RiGeminiLine } from "react-icons/ri";
import { PiBracketsCurly } from "react-icons/pi";
export const PROJECT_HEADER_ID = "projects";

export default function Projects() {
  const { konamiActivated } = useContext(KonamiContext);

  return (
    <main>
      <h2 id={PROJECT_HEADER_ID} className={styles.projectHeader}>
        // PROJECTS
      </h2>
      <GhostBackground />
      <div className={styles.projectContainer}>
        {projectList.map((proj) => (
          <ProjectCard
            key={proj.title}
            title={proj.title}
            description={proj.description}
            technologies={proj.technologies}
            destinationUrl={proj.destinationUrl}
            imgUrl={proj.imgUrl}
            imageBorder={proj.imageBorder}
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

function getTech(techName: string): ProjectTechnology {
  const tech = technologyList.find((t) => t.name === techName);
  if (!tech) {
    throw new Error(`Technology "${techName}" not found`);
  }
  return tech;
}

const technologyList: ProjectTechnology[] = [
  { name: "Typescript", icon: <TbBrandTypescript /> },
  { name: "Javascript", icon: <TbBrandJavascript /> },
  { name: "Java", icon: <FaJava /> },
  { name: "Firebase", icon: <SiFirebase /> },
  { name: "Firestore", icon: <TbBrandFirebase /> },
  { name: "Firebase Functions", icon: <PiBracketsCurly /> },
  { name: "Authentication", icon: <SiFirebase /> },
  { name: "Spotify API", icon: <TbBrandSpotify /> },
  { name: "Gemini API Integration", icon: <RiGeminiLine /> },
];

const projectList: ProjectCardProps[] = [
  {
    title: "Prey Simulation",
    description:
      "A simple predator/prey environment was simulated using a turtle class and rudimentary AI. Originally implemented in Java, refreshed in JavaScript.",
    technologies: [getTech("Typescript"), getTech("Java")],
    destinationUrl: "/projects/predator-prey-simulator",
    imgUrl: PacSimImgUrl,
  },
  {
    title: "Mayfly",
    description:
      "Time sheet application custom built to manage hours reporting for a small business (my parents'). It is a React app that utilizes Firebase.",
    technologies: [
      getTech("Typescript"),
      getTech("Firestore"),
      getTech("Authentication"),
    ],
    destinationUrl: "https://github.com/asa-dillahunty/Mayfly",
    imgUrl: MayflyImgUrl,
  },
  {
    title: "Musical Jeopardy",
    description:
      "Jeopardy but instead of clues, songs play, and users guess the song's artist. Currently invite only.",
    technologies: [
      getTech("Typescript"),
      getTech("Firestore"),
      getTech("Spotify API"),
      getTech("Gemini API Integration"),
      getTech("Firebase Functions"),
    ],
    destinationUrl: "https://musical-jeopardy.firebaseapp.com/",
    imgUrl: "https://musical-jeopardy.firebaseapp.com/logoFull.png",
    imageBorder: false,
  },
  {
    title: "Letter Boxed Solver",
    description:
      "Solution finder for the New York Times game Letter Boxed. Currently in search of an official dictionary (or just a better one that doesn't contain 'words' like \"hdkf\").",
    technologies: [getTech("Javascript"), getTech("Firebase Functions")],
    destinationUrl: "https://letterboxed.asadillahunty.com/",
    imgUrl: LetterBoxedImgUrl,
  },
  {
    title: "Maze Algorithms",
    description:
      "Mazes were generated using Prim's algorithm and solved via recursive backtracking.",
    technologies: [getTech("Javascript"), getTech("Java")],
    destinationUrl:
      "https://asa-dillahunty.github.io/Maze-Generation-and-Solving/",
    imgUrl: MazePreviewImgUrl,
  },
  {
    title: "Qubic Tic Tac Toe",
    description:
      "3 Dimensional Tic Tac Toe with a simple 2D interface. Includes a point-based bot to play against.",
    technologies: [getTech("Javascript"), getTech("Firebase")],
    destinationUrl: "https://asa-dillahunty.github.io/QubicTicTacToe/",
    imgUrl: QubicTicTacToeImgUrl,
  },
];
