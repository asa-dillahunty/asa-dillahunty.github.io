import { FaFilePdf, FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import styles from "./stylesheets/ContactModal.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

import resume from "../assets/AsaDillahuntyResume.pdf";
import { Link } from "react-router-dom";

export default function ContactModal({ contactModalRef }) {
  const copyToClipboard = (copiedText: string) => {
    navigator.clipboard
      .writeText(copiedText)
      .then(() => {
        notify();
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  const notify = () => toast("Email copied to clipboard!");

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick={true}
      />
      <div
        className={styles.modalContainer}
        onClick={(e) => {
          e.stopPropagation(); // this prevents the dialog from closing itself
        }}
      >
        <div className={styles.modalBackground}></div>

        <a
          className={styles.modalCard}
          href="https://github.com/asa-dillahunty"
        >
          <FaGithub />
          <p>Check out my GitHub</p>
        </a>

        <a
          className={styles.modalCard}
          href="https://www.linkedin.com/in/asa-dillahunty"
        >
          <FaLinkedin />
          <p>Check out my LinkedIn</p>
        </a>

        <a
          className={styles.modalCard}
          onClick={() => copyToClipboard("asadillahunty@gmail.com")}
        >
          <MdEmail />
          <p>
            Email me: <span>asadillahunty@gmail.com</span>
          </p>
        </a>

        <Link to={resume} target="_blank" className={styles.modalCard}>
          <FaFilePdf />
          <p>Take a look at my resume</p>
        </Link>

        <div
          className={styles.closeButton}
          onClick={() => contactModalRef.current.close()}
        >
          <AiOutlineClose />
        </div>
      </div>
    </>
  );
}
