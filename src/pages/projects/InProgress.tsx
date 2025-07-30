import styles from "./stylesheets/ProjectPage.module.scss";
import PageContainer from "../PageContainer";
import BombGameImgUrl from "../../assets/images/bombGame.png";
import MarsCitiesImgUrl from "../../assets/images/marsCities.png";
import AsciiImgUrl from "../../assets/images/phant.png";
// import BouncingBall from "../inProgress/BouncingBall";

export default function InProgress() {
  return (
    <PageContainer header="In Progress">
      <main className={styles.main}>
        {/* <BouncingBall /> */}
        <ul className={styles.linkList}>
          {inProgressProjectList.map((project) => {
            return (
              <li key={project.title}>
                <a href={project.destinationUrl}>{project.title}</a>
              </li>
            );
          })}
        </ul>
        <h2>Old Projects</h2>
        <ul className={styles.linkList}>
          {archivedProjectList.map((project) => {
            return (
              <li key={project.title}>
                <a href={project.destinationUrl}>{project.title}</a>
              </li>
            );
          })}
        </ul>
      </main>
    </PageContainer>
  );
}

const inProgressProjectList = [
  {
    title: "Dungeon Generation",
    destinationUrl: "https://asa-dillahunty.github.io/Dungeon-Generation/",
  },
  {
    title: "Subway Surfers and Markov Chains",
    destinationUrl: "/in-progress/subway-surfers-markov-chains",
  },
  {
    title: "Olympic Fantasy Climbing Draft",
    destinationUrl: "climbing/",
  },
  { title: "Sudoku", destinationUrl: "sudoku/" },
];

const archivedProjectList = [
  {
    title: "Draft A Date",
    destinationUrl: "draftadate/",
  },
  {
    title: "Capture the Flag",
    description:
      "Simple AI's were created to play capture the flag on a 2D plane.",
    destinationUrl: "/projects/capture-the-flag",
    imgUrl: BombGameImgUrl,
  },
  {
    title: "Path Finding",
    description:
      "Cities were built on a terrain map, and then connected using Dijkstra's algorithm.",
    destinationUrl: "/projects/mars-paths",
    imgUrl: MarsCitiesImgUrl,
  },
  {
    title: "ASCII It!",
    description:
      "This program was written for Crimson Hacks. It converts images compatible with JAVA's BufferedImage class into ASCII representations.",
    destinationUrl: "/projects/ascii-art",
    imgUrl: AsciiImgUrl,
  },
];
