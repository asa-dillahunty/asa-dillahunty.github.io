import terrain_mini from "../../assets/images/terrain-mini.png";
import mscs_output_mini from "../../assets/images/mscs_output-mini.png";
import mars_path_mini from "../../assets/images/mars_path-mini.png";
import cost_map_mini from "../../assets/images/costMap-mini.png";

import terrain from "../../assets/images/terrain.png";
import mscs_output from "../../assets/images/mscs_output.png";
import mars_path from "../../assets/images/mars_path.png";
import cost_map from "../../assets/images/costMap.png";

import styles from "./stylesheets/ProjectPage.module.scss";
import PageContainer from "../PageContainer";

export default function MarsPaths() {
  return (
    <PageContainer header="Path Finding">
      <main className={styles.main}>
        <h2>City Construction</h2>

        <p>
          Before beginning a path searching problem, there must first be things
          to connect with paths. For this assignment we were to read in a
          terrain map of a habitable land area, and build a completely
          completely flat city on it. My city was titled AceHill.
        </p>
        <p>
          Elevation at a certain pixel on the terrain map is represented as it's
          color value. White being the highest at 255 and black being the lowest
          at 0. For a city to be valid it must be 500 by 500 pixels, a constant
          elevation, and the connected land cannot have a difference in
          elevation over 1. The cost to build a city was determined by the
          pixel's elevation change multiplied by the cost map's value at that
          height. The cost map was built based on how often pixels were chosen
          to be settled.
        </p>

        <ul className={styles.exampleImages}>
          <li>
            <figure>
              <a href={terrain} target="_blank">
                <img src={terrain_mini} alt="Terrain Map" width="300" />
              </a>
              <figcaption>Terrain</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <a href={mscs_output} target="_blank">
                <img
                  src={mscs_output_mini}
                  alt="Terrain Map with cities built."
                  width="300"
                />
              </a>
              <figcaption>Settled Terrain</figcaption>
            </figure>
          </li>
        </ul>

        <h2>Developing Trade Routes</h2>
        <p>
          After each of the cities were built, it was important to establish
          roads to each of the other cities. One could use A* to compute the
          paths to each of the cites, but because there are so many cities, it
          would be faster to perform Dijkstra's on the entire map and work back
          from each city.
        </p>

        <p>
          For the road map on the left, the roads constructed are a single, red
          pixel wide. Selecting the picture should open a larger version in a
          separate tab to see the roads more easily. The cost map on the right
          is a visual representation where the cost to travel from AceHill to
          that pixel is 256 raised to the value in green channel plus the value
          in the blue channel.
        </p>

        <ul className={styles.exampleImages}>
          <li>
            <figure>
              <a href={mars_path} target="_blank">
                <img
                  src={mars_path_mini}
                  alt="Road Map from AceHill to all other cities."
                  width="300"
                />
              </a>
              <figcaption>Road Map</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <a href={cost_map} target="_blank">
                <img src={cost_map_mini} alt="Cost Map" width="300" />
              </a>
              <figcaption>Cost Map</figcaption>
            </figure>
          </li>
        </ul>
      </main>
    </PageContainer>
  );
}
