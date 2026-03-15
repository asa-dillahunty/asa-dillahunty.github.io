import styles from "../../projects/stylesheets/ProjectPage.module.scss";
import { useState } from "react";
import PageContainer from "../../PageContainer";
import { useParams } from "react-router-dom";

export default function SideBetPlay() {
  const { lobbyId } = useParams(); // this is the lobby id to get thing

  return (
    <PageContainer header="In Progress">
      <main className={styles.main}>
        <button onClick={() => {}}>Search Query</button>
      </main>
    </PageContainer>
  );
}
