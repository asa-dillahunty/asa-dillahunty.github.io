import { useEffect, useState } from "react";
import {
  createMarketGame,
  getAllMarketGames,
  getRandomId,
  MarketGame,
} from "./firebaseFuncs";
import { useNavigate } from "react-router-dom";
import styles from "./MarketGameModal.module.scss";

interface Props {
  mode: "edit" | "play";
  onSelect: (gameId: string) => void;
  onClose: () => void;
}

export default function MarketGameModal({ mode, onSelect, onClose }: Props) {
  const [games, setGames] = useState<MarketGame[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    const all = await getAllMarketGames();
    setGames(all);
  }

  async function createGame() {
    const newGameId = getRandomId();

    await createMarketGame({
      id: newGameId,
      events: [],
    });

    nav(`./${newGameId}`);
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Select Market Game</h2>

        <div>
          {games.map((game) => (
            <button key={game.id} onClick={() => onSelect(game.id)}>
              {game.id}
            </button>
          ))}
        </div>

        {mode === "edit" && (
          <button onClick={createGame}>Create New Game</button>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
