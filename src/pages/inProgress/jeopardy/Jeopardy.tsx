import { useRef, useState } from "react";
import { categories } from "./data";
import styles from "./Jeopardy.module.scss";

export default function Jeopardy() {
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<{ category: number; row: number } | null>(null);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const page = useRef<HTMLDivElement>(null);

  function reveal(category: number, row: number) {
    setSelected({ category, row });
    setAnswerVisible(false);
    setImageFailed(false);
    dialog.current?.showModal();
  }

  function revealAnswer() {
    if (!selected) return;
    setAnswerVisible(true);
    setOpened(previous => new Set(previous).add(`${selected.category}-${selected.row}`));
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await page.current?.requestFullscreen();
      setFullscreenError("");
    } catch {
      setFullscreenError("Fullscreen is unavailable. Try your browser’s fullscreen option.");
    }
  }

  return (
    <div className={styles.page} ref={page}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>A year in questionable taste</p><h1>Jeopardy<span>!</span></h1></div>
        <div className={styles.controls}>
          <button onClick={toggleFullscreen}>Fullscreen</button>
          <button onClick={() => { if (window.confirm("Reset all revealed tiles?")) setOpened(new Set()); }}>Reset board</button>
        </div>
      </header>
      <div className={styles.scroll}>
        <div className={styles.board} aria-label="Jeopardy board">
          {categories.map((category, column) => (
            <section className={styles.column} key={category.title} aria-label={category.title}>
              <h2>{category.title}</h2>
              {category.entries.map((entry, row) => {
                const used = opened.has(`${column}-${row}`);
                return <button
                  key={row}
                  className={`${styles.tile} ${used ? styles.used : ""}`}
                  disabled={!entry}
                  aria-label={`${category.title}, $${(row + 1) * 200}${used ? ", revealed" : ""}${!entry ? ", coming soon" : ""}`}
                  onClick={() => reveal(column, row)}
                >{entry ? <><span>${(row + 1) * 200}</span>{used && <small>Revealed</small>}</> : <small>Coming soon</small>}</button>;
              })}
            </section>
          ))}
        </div>
      </div>
      {fullscreenError && <p role="status">{fullscreenError}</p>}
      <dialog ref={dialog} className={styles.reveal} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        {selected && <div className={styles.revealContent}>
          <button className={styles.closeButton} aria-label="Close card" onClick={() => dialog.current?.close()}>×</button>
          <p className={styles.eyebrow}>{categories[selected.category].title} · ${(selected.row + 1) * 200}</p>
          <h2 aria-live="polite" className={`${styles.cardText} ${answerVisible ? styles.answerVisible : ""}`}>
            <span className={styles.clueText} aria-hidden={answerVisible}>{categories[selected.category].entries[selected.row]?.clue}</span>
            <span className={styles.answerText} aria-hidden={!answerVisible}>
              <span>{categories[selected.category].entries[selected.row]?.answer}</span>
              <span className={styles.artwork}>
                {imageFailed ? <span className={styles.imageFallback}>Artwork unavailable</span> : <img
                  key={`${selected.category}-${selected.row}`}
                  src={categories[selected.category].entries[selected.row]?.imageUrl}
                  alt={`Artwork for ${categories[selected.category].entries[selected.row]?.answer}`}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                />}
              </span>
            </span>
          </h2>
          {!answerVisible && <button autoFocus onClick={() => {
            revealAnswer();
            dialog.current?.querySelector<HTMLButtonElement>(`.${styles.closeButton}`)?.focus({ preventScroll: true });
          }}>Show answer</button>}
        </div>}
      </dialog>
    </div>
  );
}
