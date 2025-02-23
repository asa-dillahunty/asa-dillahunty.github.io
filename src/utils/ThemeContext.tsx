import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import colors from "../variablesExport.module.scss";
import { KonamiContext } from "./KonamiContext";

const initDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: initDarkMode,
  mazeColors: getMazeColors(initDarkMode),
  staticColors: getStaticColors(initDarkMode),
});

export interface ThemeContextType {
  darkMode: boolean;
  mazeColors: MazeColorsType;
  staticColors: StaticColorsType;
}

export interface MazeColorsType {
  default: string;
  deadend: string;
  solution: string;
  wall: string;
}

export interface StaticColorsType {
  bg: string;
  primary: string;
}

function getMazeColors(darkMode: boolean) {
  if (darkMode) {
    return {
      default: colors.mazeDefault,
      deadend: colors.mazeDeadEnd,
      solution: colors.mazeSolution,
      wall: colors.mazeWall,
    };
  } else {
    return {
      default: colors.mazeDefaultLight,
      deadend: colors.mazeDeadEndLight,
      solution: colors.mazeSolutionLight,
      wall: colors.mazeWallLight,
    };
  }
}

function getStaticColors(darkMode: boolean) {
  if (darkMode) {
    return {
      bg: colors.staticBg,
      primary: colors.staticPrimary,
    };
  } else {
    return {
      bg: colors.staticBgLight,
      primary: colors.staticPrimaryLight,
    };
  }
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [darkMode, setDarkMode] = useState(initDarkMode);
  const [mazeColors, setMazeColors] = useState<MazeColorsType>(
    getMazeColors(initDarkMode)
  );
  const [staticColors, setStaticColors] = useState<StaticColorsType>(
    getStaticColors(initDarkMode)
  );

  const { konamiActivated } = useContext(KonamiContext);

  const updateTheme = () => {
    const darkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(darkMode);
  };

  useEffect(() => {
    // update maze colors
    if (konamiActivated) {
      setMazeColors(getMazeColors(!darkMode));
      setStaticColors(getStaticColors(!darkMode));
    } else {
      setMazeColors(getMazeColors(darkMode));
      setStaticColors(getStaticColors(darkMode));
    }
  }, [darkMode, konamiActivated]);

  useEffect(() => {
    updateTheme();
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", updateTheme);

    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", updateTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, mazeColors, staticColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
