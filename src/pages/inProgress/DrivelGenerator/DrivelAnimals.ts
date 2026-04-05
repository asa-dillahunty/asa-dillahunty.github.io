import penguinTyping from "./assets/images/penguin-typing.gif";
import catTyping from "./assets/images/cat-typing.gif";
import monkeyTyping from "./assets/images/monkey-typing.gif";
import dogTyping from "./assets/images/dog-typing.gif";

export enum AnimalTypes {
  monkey,
  cat,
  dog,
  penguin,
}

export type DrivelAnimal = {
  type: AnimalTypes;
  lettersPerSecond: number;
  drivelOrder: number;
  imgSrc: string;
};

export function getDrivelAnimal(type: AnimalTypes) {
  const thisAnimal = animals.find((animal) => animal.type === type);
  if (!thisAnimal) throw new Error("provided bad drivel animal type");
  return thisAnimal;
}

const animals: DrivelAnimal[] = [
  newAnimal(AnimalTypes.penguin, 2, 8, penguinTyping),
  newAnimal(AnimalTypes.cat, 0, 40, catTyping),
  newAnimal(AnimalTypes.monkey, 4, 8, monkeyTyping),
  newAnimal(AnimalTypes.dog, 2, 14, dogTyping),
];

function newAnimal(
  type: AnimalTypes,
  drivelOrder: number,
  lettersPerSecond: number,
  imgSrc: string,
) {
  return {
    type: type,
    drivelOrder: drivelOrder,
    lettersPerSecond: lettersPerSecond,
    imgSrc: imgSrc,
  };
}
