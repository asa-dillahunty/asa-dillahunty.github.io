import { Link } from "react-router-dom";
import styles from "./stylesheets/ProjectCard.module.scss";
import { IoCode } from "react-icons/io5";
import { ReactElement, useContext } from "react";
import { KonamiContext } from "../utils/KonamiContext";

export type ProjectCardProps = {
  title: string;
  description: string;
  technologies: ProjectTechnology[];
  imgUrl: string;
  destinationUrl: string;
  imageBorder?: boolean;
};

export type ProjectTechnology = {
  name: string;
  icon?: ReactElement;
};

export default function ProjectCard({
  title,
  description,
  technologies,
  imgUrl,
  destinationUrl,
  imageBorder = true,
}: ProjectCardProps) {
  const { konamiActivated } = useContext(KonamiContext);

  return (
    <div
      className={styles.proj + (konamiActivated ? " " + styles.static : "")}
      id={title}
    >
      <div className={styles.words}>
        <div className={styles.title}>
          <h3>
            <Link to={destinationUrl}>{title}</Link>
          </h3>
        </div>
        <div className={styles.technologies}>
          {technologies.map((tech) => (
            <span key={tech.name}>
              {konamiActivated ? (
                <>
                  {tech.icon ? (
                    tech.icon
                  ) : (
                    <IoCode className={styles.staticLogo} />
                  )}{" "}
                  {tech.name}
                </>
              ) : (
                <>
                  <IoCode /> {tech.name}
                </>
              )}
            </span>
          ))}
        </div>
        <div className={styles.summary}>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.image}>
        <Link to={destinationUrl}>
          {
            <img
              src={imgUrl}
              alt=""
              style={imageBorder ? {} : { border: "none" }}
            />
          }
        </Link>
      </div>
    </div>
  );
}
