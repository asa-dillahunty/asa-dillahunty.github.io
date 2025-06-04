import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ContactModal from "./ContactModal";

import styles from "./stylesheets/Navigation.module.scss";
import { PROJECT_HEADER_ID } from "../pages/Projects";

export default function Navigation() {
  const contactModalRef = useRef<HTMLDialogElement | null>(null);
  const path = useLocation();

  const projectHeader = window.document.getElementById(PROJECT_HEADER_ID);
  const projectHash = "#" + PROJECT_HEADER_ID;

  const isHome = path.pathname === "/" && path.hash === "";
  const isProjects = path.pathname === "/" && path.hash === projectHash;

  return (
    <>
      <dialog
        ref={contactModalRef}
        onClick={() => contactModalRef.current?.close()}
      >
        <ContactModal contactModalRef={contactModalRef} />
      </dialog>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/" className={isHome ? styles.current : ""}>
              Home
              <div className={styles.bar}></div>
            </Link>
          </li>
          <li>
            <Link
              to={"/" + projectHash}
              className={isProjects ? styles.current : ""}
              onClick={() => {
                if (isProjects && projectHeader) {
                  // we are already here, so we must scroll manually
                  projectHeader.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Projects
              <div className={styles.bar}></div>
            </Link>
          </li>
          <li>
            <a
              onClick={() => {
                contactModalRef.current?.showModal();
              }}
            >
              Contact Me
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
