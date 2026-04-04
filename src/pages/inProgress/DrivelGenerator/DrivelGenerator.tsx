import { useEffect, useRef, useState } from "react";
import PageContainer from "../../PageContainer";

import frankenstein from "./assets/books/frankenstein.txt?raw";
import gatsby from "./assets/books/great-gatsby.txt?raw";
import moby from "./assets/books/moby-dick.txt?raw";
import pride from "./assets/books/pride-and-predjudice.txt?raw";

import penguinTyping from "./assets/images/penguin-typing.gif";

const books = [
  { title: "Frankenstein", text: cleanText(frankenstein) },
  { title: "The Great Gatsby", text: cleanText(gatsby) },
  { title: "Moby Dick", text: cleanText(moby) },
  { title: "Pride and Prejudice", text: cleanText(pride) },
];

function cleanText(raw: string) {
  // str = str.replace(/ +(?= )/g,'');
  return raw
    .replace(/ +(?= )/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/(?<!\n)\n(?!\n)/g, " ") // remove hard wraps
    .replace(/\n{3,}/g, "\n\n") // normalize paragraphs
    .trim();
}

function getNextChar(seed: string, text: string): string {
  if (!seed || seed.length === 0) return "";
  if (text.length <= seed.length) return "";

  const startIndex = Math.floor(Math.random() * (text.length - seed.length));

  for (let i = startIndex; i < text.length - seed.length; i++) {
    if (text.slice(i, i + seed.length) === seed) {
      return text[i + seed.length];
    }
  }

  // wrap around if no match
  for (let i = 0; i < startIndex; i++) {
    if (text.slice(i, i + seed.length) === seed) {
      return text[i + seed.length];
    }
  }

  return ""; // no match (should literally be impossible)
}

function getSeedString(bookText: string, length: number): string {
  if (length <= 0) return "";
  if (bookText.length <= length) return bookText;

  const maxStart = bookText.length - length;
  let start = Math.floor(Math.random() * maxStart);
  let end = start + length;

  // expand start backward to nearest space
  while (start > 0 && bookText[start] !== " ") {
    start--;
  }

  // expand end forward to nearest space
  while (end < bookText.length && bookText[end] !== " ") {
    end++;
  }

  return bookText.slice(start, end).trim();
}

export default function DrivelGenerator() {
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const seedRef = useRef<string>(""); // mutable seed
  const intervalRef = useRef<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const SEED_LENGTH = 2;
  const MAX_LENGTH = 2000;
  const LETTERS_PER_SECOND = 10;
  const INTERVAL_LENGTH = 1000 / LETTERS_PER_SECOND;
  // const INTERVAL_LENGTH = 1;

  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  function step() {
    let seed = seedRef.current;
    while (seed.length > SEED_LENGTH) {
      seedRef.current = seed.slice(1);
      seed = seedRef.current;
    }

    const next = getNextChar(seed, books[selectedBookIndex].text);

    if (!next) {
      // reseed if dead end
      seedRef.current = getSeedString(
        books[selectedBookIndex].text,
        SEED_LENGTH,
      );
      return;
    }

    seedRef.current = seed.slice(1) + next;

    setOutput((prev) => {
      const updated = prev + next;
      return updated.length > MAX_LENGTH
        ? updated.slice(updated.length - MAX_LENGTH)
        : updated;
    });
  }

  function start() {
    if (running) return;

    seedRef.current = getSeedString(books[selectedBookIndex].text, SEED_LENGTH);
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
    <PageContainer header="Driveling">
      <main>
        <img
          src={penguinTyping}
          alt="Penquin Typing"
          style={{
            width: 600,
            display: "block",
            margin: "0 auto 10px",
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
        <p>{books[selectedBookIndex].title}</p>

        <div style={{ width: 600 }}>
          <div
            ref={boxRef}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              height: "200px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
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
