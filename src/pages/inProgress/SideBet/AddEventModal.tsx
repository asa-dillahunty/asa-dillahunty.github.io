import { useState } from "react";
import {
  getEventBySlug,
  getPolyMarketSlugFromUrl,
  PolymarketEvent,
} from "./polymarketFuncs";

import styles from "./MarketGameModal.module.scss";

interface Props {
  onAdd: (event: PolymarketEvent) => void;
  onClose: () => void;
}

export default function AddEventModal({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      console.log("here");
      setLoading(true);
      setError("");

      const slug = getPolyMarketSlugFromUrl(url);

      const event = await getEventBySlug(slug);

      if (!event) {
        setError("Event not found");
        return;
      }
      console.log(event);

      onAdd(event);
    } catch (err) {
      setError("Invalid Polymarket URL");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Add Polymarket Event</h2>

        <input
          placeholder="Paste Polymarket URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Event"}
          </button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
