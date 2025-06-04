import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

import "./stylesheets/Footer.scss";

export default function Footer() {
  return (
    <footer>
      <div className="footer-image-container">
        <a href="https://github.com/asa-dillahunty" target="_blank">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/asa-dillahunty" target="_blank">
          <FaLinkedin />
        </a>
        <a href="mailto:asadillahunty@gmail.com" target="_blank">
          <SiGmail />
        </a>
      </div>
      <span>&#169; 2025 Asa Dillahunty. All rights reserved</span>
    </footer>
  );
}
