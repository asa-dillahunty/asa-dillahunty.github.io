import { useContext, useEffect, useRef, useState } from "react";

import Navigation from "../components/Navigation";
import MazeCanvas from "../components/MazeCanvas";

import logo from "../assets/images/AceFace.png";

import styles from "./stylesheets/Home.module.scss";
import { KonamiContext } from "../utils/KonamiContext";
import Projects from "./Projects";
import Footer from "../components/Footer";

function Home() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [mazeProps, setMazeProps] = useState({ width: 0, height: 0 });
  const { konamiActivated } = useContext(KonamiContext);

  useEffect(() => {
    if (headerRef?.current) {
      setMazeProps({
        width: headerRef.current.clientWidth,
        height: headerRef.current.clientHeight,
      });
    }
  }, [headerRef]);

  return (
    <>
      <header className={styles.header} ref={headerRef}>
        <Navigation />
        <h1>Asa Dillahunty</h1>
        {konamiActivated && <img src={logo} className={styles.staticLogo} />}
        <MazeCanvas container={mazeProps} />
      </header>
      <Projects />
      <Footer />
    </>
  );
}

export default Home;
