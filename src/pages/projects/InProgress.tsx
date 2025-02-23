import { Link } from "react-router-dom";
import styles from "./stylesheets/ProjectPage.module.scss";
import PageContainer from "../PageContainer";

export default function InProgress() {
  return (
    <PageContainer header="In Progress">
      <main className={styles.main}>
        <ul className={styles.linkList}>
          <li>
            <a href="https://asa-dillahunty.github.io/Dungeon-Generation/">
              Dungeon Generation
            </a>
          </li>
          <li>
            <Link to="/in-progress/subway-surfers-markov-chains">
              Subway Surfers and Markov Chains
            </Link>
          </li>
          <li>
            <a href="climbing/">Olympic Fantasy Climbing Draft</a>
          </li>
        </ul>
        <h2>Old Projects</h2>
        <ul className={styles.linkList}>
          <li>
            <a href="draftadate/">Draft A Date</a>
          </li>
        </ul>
      </main>
    </PageContainer>
  );
}
