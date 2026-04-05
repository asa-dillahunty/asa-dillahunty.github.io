import PageContainer from "../../PageContainer";
import { AnimalTypes } from "./DrivelAnimals";
import Driveler from "./Driveler";

import styles from "./stylesheets/DrivelGenerator.module.scss";

export default function DrivelGenerator() {
  return (
    <PageContainer header="Driveling">
      <main>
        <div className={styles.drivelersContainer}>
          <Driveler animalType={AnimalTypes.monkey} />
          <Driveler animalType={AnimalTypes.penguin} />
          <Driveler animalType={AnimalTypes.cat} />
          <Driveler animalType={AnimalTypes.dog} />
        </div>
        <h3>Sources</h3>
        <span>
          All books stolen from{" "}
          <a href="https://www.gutenberg.org/about/">Project Gutenberg</a>
        </span>
        <span>
          Project inspiration comes from Brian Hayes' blog,{" "}
          <a href="http://bit-player.org/2013/driveling/">bit-player</a>
        </span>
      </main>
    </PageContainer>
  );
}
