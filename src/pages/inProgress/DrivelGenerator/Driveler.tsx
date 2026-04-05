import { useEffect, useRef, useState } from "react";

import {
  drivelSourceBooks as books,
  getDrivelSeedString,
  getNextDrivelChar,
} from "./assets/utils";

import styles from "./stylesheets/Driveler.module.scss";
import { AnimalTypes, getDrivelAnimal } from "./DrivelAnimals";

type DrivelerProps = {
  animalType: AnimalTypes;
};

export default function Driveler({ animalType }: DrivelerProps) {
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const seedRef = useRef<string>(""); // mutable seed
  const intervalRef = useRef<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // this can be memoized, should never change
  const animal = getDrivelAnimal(animalType);

  const DRIVEL_ORDER = animal.drivelOrder;
  const MAX_LENGTH = 2000;
  const INTERVAL_LENGTH = 1000 / animal.lettersPerSecond;
  // const INTERVAL_LENGTH = 1;

  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  function step() {
    let seed = seedRef.current;

    const next = getNextDrivelChar(seed, books[selectedBookIndex].text);
    // if next is a white space character or a period or something, check the previous 'word' and see if it's a real word
    // give points based on how long word is

    if (!next) {
      // reseed if dead end
      seedRef.current = getDrivelSeedString(
        books[selectedBookIndex].text,
        DRIVEL_ORDER,
      );
      return;
    }

    if (DRIVEL_ORDER > 0) {
      seedRef.current = seed.slice(1) + next;
    }

    setOutput((prev) => {
      const updated = prev + next;
      return updated.length > MAX_LENGTH
        ? updated.slice(updated.length - MAX_LENGTH)
        : updated;
    });
  }

  function start() {
    if (running) return;

    seedRef.current = getDrivelSeedString(
      books[selectedBookIndex].text,
      DRIVEL_ORDER,
    );
    setRunning(true);

    intervalRef.current = window.setInterval(step, INTERVAL_LENGTH);
  }

  function stop() {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function reset() {
    stop();
    setOutput("");
    seedRef.current = "";
  }

  useEffect(() => {
    boxRef.current?.scrollTo({
      top: boxRef.current.scrollHeight,
    });
  }, [output]);

  // cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className={styles.wrapper}>
      <img
        src={animal.imgSrc}
        alt="Animal Typing"
        className={styles.drivelerIcon}
        style={{
          opacity: running ? 1 : 0.01,
        }}
      />

      <label>Inspiration</label>
      <select
        value={selectedBookIndex}
        onChange={(e) => setSelectedBookIndex(parseInt(e.target.value))}
      >
        {books.map((book, index) => (
          <option key={book.title} value={index}>
            {book.title}
          </option>
        ))}
      </select>

      <div ref={boxRef} className={styles.outputBox}>
        {output}
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={start} disabled={running}>
          Start
        </button>
        <button onClick={stop} disabled={!running}>
          Stop
        </button>
        <button onClick={reset}>Reset</button>
      </div>

      <div style={{ marginTop: 5 }}>
        <small>
          {output.length} / {MAX_LENGTH}
        </small>
      </div>
    </div>
  );
}
