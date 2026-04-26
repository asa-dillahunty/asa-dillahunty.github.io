import { useState } from "react";
import PageContainer from "../../PageContainer";
import { AnimalTypes } from "./DrivelAnimals";
import Driveler from "./Driveler";

import styles from "./stylesheets/DrivelGenerator.module.scss";

export default function DrivelGenerator() {
  const [employees, setEmployees] = useState<AnimalTypes[]>([]);

  const hireRandom = () => {
    const temp = Math.floor(Math.random() * 4);
    switch (temp) {
      case 0:
        hireEmployee(AnimalTypes.monkey);
        break;
      case 1:
        hireEmployee(AnimalTypes.cat);
        break;
      case 2:
        hireEmployee(AnimalTypes.dog);
        break;
      case 3:
        hireEmployee(AnimalTypes.penguin);
        break;
      default:
        hireEmployee(AnimalTypes.monkey);
    }
  };

  const hireEmployee = (animalType: AnimalTypes) => {
    const emps = [...employees, animalType];
    setEmployees(emps);
  };

  const fireEmployee = (index: number) => {
    const newEmps = [
      ...employees.slice(0, index),
      ...employees.slice(index + 1),
    ];
    setEmployees(newEmps);
  };

  return (
    <PageContainer header="Driveling">
      <main>
        <button onClick={() => hireRandom()}>Add Emp</button>
        <div className={styles.drivelersContainer}>
          {employees.map((animalEmp, index) => (
            <Driveler
              key={`${index} ${animalEmp}`}
              animalType={animalEmp}
              fire={() => fireEmployee(index)}
            />
          ))}
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
