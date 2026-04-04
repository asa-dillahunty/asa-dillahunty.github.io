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

export function getNextDrivelChar(seed: string, text: string): string {
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

export function getDrivelSeedString(bookText: string, length: number): string {
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
