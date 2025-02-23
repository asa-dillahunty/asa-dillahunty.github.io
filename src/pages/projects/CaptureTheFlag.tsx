import PageContainer from "../PageContainer";

import styles from "./stylesheets/ProjectPage.module.scss";

export default function CaptureTheFlag() {
  return (
    <PageContainer header="Capture the Flag">
      <main className={styles.main}>
        <h2>Rules</h2>
        <p>
          Two players start on opposite sides of the playing field a few blocks
          in front of their flags. The objective is simply to touch the other
          player's flag. Players have 3 options.
        </p>
        <ul id="BombGameRules">
          <li>
            Move
            <p>
              A player can move either left or right at the cost of 1 plus their
              change in height.
            </p>
          </li>
          <li>
            Dirt
            <p>
              A player can move a single block of dirt from their immediate
              left, right, or their own position, to either of those three
              positions at the cost of 1 turn.
            </p>
          </li>
          <li>
            Bomb
            <p>
              A player can throw a bomb to destroy terrain anywhere on the map
              at the cost of the floor of distance divided by 10 plus the radius
              of the explosion raised to 1.5.
            </p>
          </li>
        </ul>

        <iframe
          className={styles.iframe}
          src="https://www.youtube.com/embed/pxtkB6XrSoE"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </main>
    </PageContainer>
  );
}
