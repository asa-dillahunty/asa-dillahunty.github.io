import { useEffect, useState } from "react";
import PageContainer from "../../PageContainer";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEventBySlug,
  getWinningMarket,
  PolymarketEvent,
} from "./polymarketFuncs";
import {
  addEventToMarketGame,
  getAllPicks,
  getMarketGameById,
} from "./firebaseFuncs";
import AddEventModal from "./AddEventModal";

type PlayerResult = {
  nickname: string;
  profit: number;
  correct: number;
  total: number;
};

export default function SideBetHosting() {
  const { lobbyId } = useParams();
  const nav = useNavigate();

  const [currentEvents, setCurrentEvents] = useState<PolymarketEvent[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [results, setResults] = useState<PlayerResult[] | null>(null);

  useEffect(() => {
    if (!lobbyId) return;
    loadEvents();
  }, [lobbyId]);

  async function loadEvents() {
    if (!lobbyId) return;

    const game = await getMarketGameById(lobbyId);
    setCurrentEvents(game?.events ?? []);
  }

  async function handleAddEvent(event: PolymarketEvent) {
    if (!lobbyId) return;

    if (currentEvents.some((e) => e.slug === event.slug)) {
      alert("Event already added");
      return;
    }
    console.log("here");

    await addEventToMarketGame(lobbyId, event);
    console.log("here");

    await loadEvents();

    setShowModal(false);
  }

  async function finishGame() {
    if (!lobbyId) return;

    const picks = await getAllPicks(lobbyId);

    const game = await getMarketGameById(lobbyId);
    const events = game?.events ?? [];

    const results: PlayerResult[] = [];

    // re-fetch real polymarket results
    const resolvedEvents = await Promise.all(
      events.map(async (event) => {
        return await getEventBySlug(event.slug);
      }),
    );

    for (const player of picks) {
      let profit = 0;
      let correct = 0;

      for (const pick of player.picks) {
        const event = resolvedEvents.find((e) => e.slug === pick.eventSlug);

        if (!event) continue;

        const winningMarket = getWinningMarket(event);

        const betAmount = 100;

        if (winningMarket.groupItemTitle === pick.market) {
          const payout = betAmount / pick.odds;
          profit += payout - betAmount;
          correct++;
        } else {
          profit -= betAmount;
        }
      }

      results.push({
        nickname: player.nickname,
        profit,
        correct,
        total: player.picks.length,
      });
    }

    results.sort((a, b) => b.profit - a.profit);

    setResults(results);
  }

  return (
    <PageContainer header={`Game ${lobbyId}`}>
      <main>
        <button onClick={() => nav(-1)}>back</button>

        {currentEvents.map((event) => (
          <div key={event.slug}>
            <h3>{event.title}</h3>
            <small>{event.slug}</small>
          </div>
        ))}

        <button onClick={() => setShowModal(true)}>Add Event</button>

        {showModal && (
          <AddEventModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddEvent}
          />
        )}

        <button onClick={finishGame}>Close Markets</button>

        {results && (
          <div>
            <h2>Results</h2>

            {results.map((r, i) => {
              let background = "#fff";

              if (i === 0) background = "#FFD700"; // gold
              if (i === 1) background = "#C0C0C0"; // silver
              if (i === 2) background = "#CD7F32"; // bronze

              return (
                <div
                  key={r.nickname}
                  style={{
                    background,
                    border: "1px solid #ccc",
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 8,
                    boxSizing: "border-box",
                    color: i < 3 ? "#000" : "#333",
                    fontWeight: i < 3 ? 700 : 500,
                  }}
                >
                  <strong>
                    #{i + 1} {r.nickname}
                  </strong>

                  <div>Profit: ${r.profit.toFixed(2)}</div>

                  <div>
                    Correct: {r.correct}/{r.total}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
