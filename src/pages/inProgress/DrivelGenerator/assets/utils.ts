import frankenstein from "./books/frankenstein.txt?raw";
import gatsby from "./books/great-gatsby.txt?raw";
import moby from "./books/moby-dick.txt?raw";
import pride from "./books/pride-and-predjudice.txt?raw";

export const drivelSourceBooks = [
  { title: "Frankenstein", text: cleanText(frankenstein) },
  { title: "The Great Gatsby", text: cleanText(gatsby) },
  { title: "Moby Dick", text: cleanText(moby) },
  { title: "Pride and Prejudice", text: cleanText(pride) },
];

function cleanText(raw: string) {
  // currently having an issue with Great Gatsby: repeated -------------
  return raw
    .replace(/ +(?= )/g, "") // removes multiple spaces (for pride and prejudice)
    .replace(/\r\n/g, "\n")
    .replace(/(?<!\n)\n(?!\n)/g, " ") // remove hard wraps
    .replace(/\n{3,}/g, "\n\n") // normalize paragraphs
    .trim();
}

export function getNextDrivelChar(seed: string, sourceText: string): string {
  if (!seed || seed.length === 0) {
    return sourceText[Math.floor(Math.random() * (sourceText.length - 1))];
  }
  if (sourceText.length <= seed.length) return "";

  const startIndex = Math.floor(
    Math.random() * (sourceText.length - seed.length),
  );

  for (let i = startIndex; i < sourceText.length - seed.length; i++) {
    // check ignoring case
    if (
      sourceText.slice(i, i + seed.length).toLowerCase() === seed.toLowerCase()
    ) {
      return sourceText[i + seed.length];
    }
  }

  // wrap around if no match
  for (let i = 0; i < startIndex; i++) {
    if (sourceText.slice(i, i + seed.length) === seed) {
      return sourceText[i + seed.length];
    }
  }

  return ""; // no match (should literally be impossible)
}

export function getDrivelSeedString(
  sourceText: string,
  length: number,
): string {
  if (length <= 0) return "";
  if (sourceText.length <= length) return sourceText;

  const maxStart = sourceText.length - length;
  let start = Math.floor(Math.random() * maxStart);
  let end = start + length;

  // expand end forward to nearest space, start should follow so the seed length stays the same
  while (end < sourceText.length && sourceText[end] !== " ") {
    start++;
    end++;
  }

  return sourceText.slice(start, end).trim();
}
