import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Lost from "./pages/Lost";
import Projects from "./pages/Projects";
import InProgress from "./pages/projects/InProgress";
import PreySimulator from "./pages/projects/PreySimulator";
import MarsPaths from "./pages/projects/MarsPaths";
import CaptureTheFlag from "./pages/projects/CaptureTheFlag";
import AsciiArt from "./pages/projects/AsciiArt";
import SubwayMarkov from "./pages/inProgress/SubwayMarkov";

import "./index.scss";
import { KonamiProvider } from "./utils/KonamiContext";
import { ThemeProvider } from "./utils/ThemeContext";
import Sudoku from "./pages/inProgress/Sudoku/Sudoku";

function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <KonamiProvider>
      <ThemeProvider>
        <Routes>
          {routeList.map((route) => (
            <Route key={route.path} path={route.path} element={route.elem} />
          ))}
        </Routes>
      </ThemeProvider>
    </KonamiProvider>
  );
}

export default App;

const routeList = [
  { path: "/", elem: <Home /> },
  { path: "/*", elem: <Lost /> },
  { path: "/projects", elem: <Projects /> },
  { path: "/in-progress", elem: <InProgress /> },
  { path: "/projects/predator-prey-simulator", elem: <PreySimulator /> },
  { path: "/projects/mars-paths", elem: <MarsPaths /> },
  { path: "/projects/capture-the-flag", elem: <CaptureTheFlag /> },
  { path: "/projects/ascii-art", elem: <AsciiArt /> },
  {
    path: "/in-progress/subway-surfers-markov-chains",
    elem: <SubwayMarkov />,
  },
  { path: "/in-progress/sudoku", elem: <Sudoku /> },
];
