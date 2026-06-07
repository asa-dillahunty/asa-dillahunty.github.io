import PageContainer from "../../PageContainer";
import styles from "./MazeGeneration.module.scss";

export default function MazeGeneration() {
  return (
    <PageContainer header="Maze Generation">
      <main className={styles.main}>
        <h2>How build maze?</h2>

        <p>We got a couple options here</p>
        <p>Prim's algo or recursive backtracking</p>
      </main>
    </PageContainer>
  );
}
