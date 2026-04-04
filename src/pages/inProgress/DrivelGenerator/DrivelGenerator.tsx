import { useState } from "react";
import PageContainer from "../../PageContainer";

import frankenstein from "./assets/frankenstein.txt?raw";
import gatsby from "./assets/great-gatsby.txt?raw";
import moby from "./assets/moby-dick.txt?raw";
import pride from "./assets/pride-and-predjudice.txt?raw";

const books = [
  { title: "Frankenstein", text: cleanText(frankenstein) },
  { title: "The Great Gatsby", text: cleanText(gatsby) },
  { title: "Moby Dick", text: cleanText(moby) },
  { title: "Pride and Prejudice", text: cleanText(pride) },
];

function cleanText(raw: string) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/(?<!\n)\n(?!\n)/g, " ") // remove hard wraps
    .replace(/\n{3,}/g, "\n\n") // normalize paragraphs
    .trim();
}

export default function DrivelGenerator() {
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  return (
    <PageContainer header="Side Bet">
      <main>
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
        <button onClick={() => console.log(books[selectedBookIndex].text)}>
          read book
        </button>
        <p>{books[selectedBookIndex].title}</p>

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
