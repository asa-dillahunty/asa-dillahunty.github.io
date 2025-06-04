import styles from "./stylesheets/ProjectPage.module.scss";
import { MonaLisaAscii, NotreDameAscii } from "../../assets/asciiArt";
import PageContainer from "../PageContainer";

export default function AsciiArt() {
  return (
    <PageContainer header="ASCII Art">
      <main className={styles.main}>
        <h2>Premise</h2>

        <p>
          For my first Hackathon, Crimson Hacks 2017, my team decided it would
          be cool to convert standard pictures into ascii art. Here are a couple
          examples.
        </p>

        <div id="div"></div>
        <p className={styles.ascii}>
          <span
            className={styles.ascii}
            dangerouslySetInnerHTML={{ __html: NotreDameAscii }}
          ></span>
        </p>

        <h3>Notre Dame</h3>

        <p className={styles.ascii}>
          <span
            className={styles.ascii}
            dangerouslySetInnerHTML={{ __html: MonaLisaAscii }}
          ></span>
        </p>

        <h3>Mona Lisa</h3>
      </main>
    </PageContainer>
  );
}
