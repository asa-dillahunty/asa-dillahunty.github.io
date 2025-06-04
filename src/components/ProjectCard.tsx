import { Link } from "react-router-dom";
import styles from "./stylesheets/ProjectCard.module.scss";

type ProjectCardProps = {
  title: string;
  description: string;
  imgUrl: string;
  destinationUrl: string;
};

export default function ProjectCard({
  title,
  description,
  imgUrl,
  destinationUrl,
}: ProjectCardProps) {
  return (
    <div className={styles.proj} id={title}>
      <div className={styles.words}>
        <div className={styles.title}>
          <h3>
            <Link to={destinationUrl}>{title}</Link>
            {/* <a href={destinationUrl}>{title}</a> */}
          </h3>
        </div>
        <div className={styles.summary}>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.image}>
        <Link to={destinationUrl}>{<img src={imgUrl} alt="" />}</Link>
      </div>
    </div>
  );
}
