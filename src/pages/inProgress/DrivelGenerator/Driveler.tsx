import { useEffect, useRef, useState } from "react";

import {
  drivelSourceBooks as books,
  getDrivelSeedString,
  getNextDrivelChar,
  isDelimiter,
  isWord,
} from "./assets/utils";

import styles from "./stylesheets/Driveler.module.scss";
import { AnimalTypes, getDrivelAnimal } from "./DrivelAnimals";
import { CgDetailsMore } from "react-icons/cg";
import { AiOutlineClose } from "react-icons/ai";

type DrivelerProps = {
  animalType: AnimalTypes;
  fire: () => void;
};

type OutputToken = {
  text: string;
  isWord: boolean;
};

export default function Driveler({ animalType, fire }: DrivelerProps) {
  const [running, setRunning] = useState(false);
  const [autoScrolling, setAutoScrolling] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const [outputTokens, setOutputTokens] = useState<OutputToken[]>([]);
  const currentWordRef = useRef("");

  const seedRef = useRef<string>("");
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

    const completedWord = isDelimiter(next) ? currentWordRef.current : null;

    if (isDelimiter(next)) {
      currentWordRef.current = "";
    } else {
      currentWordRef.current += next;
    }

    setOutputTokens((prev) => {
      const updated = [...prev];

      if (isDelimiter(next)) {
        if (completedWord && completedWord.length > 0) {
          updated.push({
            text: completedWord,
            isWord: isWord(completedWord),
          });
        }

        updated.push({
          text: next,
          isWord: false,
        });
      }
      // trim to MAX_LENGTH
      const totalLength = updated.reduce((sum, t) => sum + t.text.length, 0);
      if (totalLength > MAX_LENGTH) {
        while (
          updated.length &&
          updated.reduce((s, t) => s + t.text.length, 0) > MAX_LENGTH
        ) {
          updated.shift();
        }
      }

      return updated;
    });
  }

  function start() {
    if (running) return;
    setRunning(true);

    seedRef.current = getDrivelSeedString(
      books[selectedBookIndex].text,
      DRIVEL_ORDER,
    );

    intervalRef.current = window.setInterval(step, INTERVAL_LENGTH);
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }

  function reset() {
    stop();
    setOutputTokens([]);
    seedRef.current = "";
  }

  useEffect(() => {
    if (!autoScrolling) return;

    boxRef.current?.scrollTo({
      top: boxRef.current.scrollHeight,
    });
  }, [outputTokens]);

  // cleanup on unmount
  useEffect(() => {
    start();
    return () => stop();
  }, []);

  return (
    <div
      className={styles.wrapper}
      onMouseLeave={() => (detailsVisible ? setDetailsVisible(false) : 0)}
    >
      <div className={styles.imageWrapper}>
        <img
          src={animal.imgSrc}
          alt="Animal Typing"
          className={styles.drivelerIcon}
        />
        <div
          className={`${styles.detailsPanel} ${detailsVisible ? styles.detailsActive : ""}`}
        >
          <label className={styles.label}>Inspiration</label>
          <select
            value={selectedBookIndex}
            className={styles.select}
            onChange={(e) => setSelectedBookIndex(parseInt(e.target.value))}
          >
            {books.map((book, index) => (
              <option key={book.title} value={index}>
                {book.title}
              </option>
            ))}
          </select>

          <div className={styles.buttons}>
            <button onClick={start} disabled={running}>
              Start
            </button>
            <button onClick={stop} disabled={!running}>
              Stop
            </button>
            <button onClick={reset}>Reset</button>
          </div>

          <div className={styles.charCount}>
            <small>
              {outputTokens.reduce((sum, t) => sum + t.text.length, 0) +
                currentWordRef.current.length}{" "}
              /{MAX_LENGTH}
            </small>
          </div>

          <button onClick={() => fire()}>Fire</button>
        </div>
        <button
          className={styles.detailsButton}
          onClick={() => setDetailsVisible(!detailsVisible)}
        >
          {detailsVisible ? <AiOutlineClose /> : <CgDetailsMore />}
        </button>
      </div>

      <div
        ref={boxRef}
        className={styles.outputBox}
        onMouseLeave={() => setAutoScrolling(true)}
        onMouseEnter={() => setAutoScrolling(false)}
      >
        {outputTokens.map((token, i) => (
          <span key={i} className={token.isWord ? styles.realWord : ""}>
            {token.text}
          </span>
        ))}
        <span>{currentWordRef.current}</span>
      </div>
    </div>
  );
}
