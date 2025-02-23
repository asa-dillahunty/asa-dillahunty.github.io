import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ContactModal from "./ContactModal";

import styles from "./stylesheets/Navigation.module.scss";

export default function Navigation() {
  const contactModalRef = useRef<HTMLDialogElement | null>(null);
  const path = useLocation();

  // if (path.pathname === "/") {
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
            <Link
              to="/"
              className={path.pathname === "/" ? styles.current : ""}
            >
              Home
              <div className={styles.bar}></div>
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className={path.pathname === "/projects" ? styles.current : ""}
            >
              Projects
              <div className={styles.bar}></div>
            </Link>
          </li>
          <li>
            <a
              onClick={() => {
                contactModalRef?.current?.showModal();
              }}
            >
              Contact Me
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
  // } else {
  //   return (
  //     <nav>
  //       <ul>
  //         <li>
  //           <a onClick={() => window.history.back()}>Back</a>
  //         </li>
  //       </ul>
  //     </nav>
  //   );
  // }
}
