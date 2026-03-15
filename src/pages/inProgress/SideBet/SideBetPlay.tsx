import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Market, PolymarketEvent } from "./polymarketFuncs";
import { getMarketGameById, submitUserPicks } from "./firebaseFuncs";
import styles from "./MarketGameModal.module.scss";

export default function SideBetPlay() {
  const { lobbyId } = useParams();

  const [nickname, setNickname] = useState("");
  const [enteredName, setEnteredName] = useState(false);

  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [selections, setSelections] = useState<SelectionMap>({});

  const [selectedEvent, setSelectedEvent] = useState<PolymarketEvent | null>(
    null,
  );

  useEffect(() => {
    if (!lobbyId) return;
    loadEvents();
  }, [lobbyId]);

  async function loadEvents() {
    const game = await getMarketGameById(lobbyId!);
    setEvents(game?.events ?? []);
  }

  function chooseMarket(eventStub: string, market: Market) {
    setSelections((prev) => ({
      ...prev,
      [eventStub]: market,
    }));
  }

  async function submitPicks() {
    if (!lobbyId) return;

    await submitUserPicks(lobbyId, nickname, selections);

    alert("Picks submitted!");
  }

  const allSelected =
    events.length > 0 && events.every((e) => selections[e.slug]);

  return (
    <main style={{ padding: 16 }}>
      {!enteredName && (
        <NicknameScreen
          nickname={nickname}
          setNickname={setNickname}
          onContinue={() => setEnteredName(true)}
        />
      )}

      {enteredName && (
        <>
          <EventList
            events={events}
            selections={selections}
            onEventClick={setSelectedEvent}
          />

          {allSelected && (
            <div>
              <button
                style={{ width: "100%", marginTop: 20, padding: 10 }}
                onClick={submitPicks}
              >
                Submit Picks
              </button>
            </div>
          )}
        </>
      )}

      {selectedEvent && (
        <MarketSelectModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSelect={(market) => {
            chooseMarket(selectedEvent.slug, market);
            setSelectedEvent(null);
          }}
        />
      )}
    </main>
  );
}

function NicknameScreen({
  nickname,
  setNickname,
  onContinue,
}: {
  nickname: string;
  setNickname: (v: string) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <h2>Enter Your Name</h2>

      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="name"
        style={{
          width: "100%",
          fontSize: 18,
          padding: 10,
          boxSizing: "border-box",
        }}
      />

      <button
        style={{
          width: "100%",
          marginTop: 12,
          padding: 10,
          boxSizing: "border-box",
        }}
        disabled={!nickname}
        onClick={onContinue}
      >
        Start Betting
      </button>
    </div>
  );
}

export type SelectionMap = Record<string, Market>;

function EventList({
  events,
  selections,
  onEventClick,
}: {
  events: PolymarketEvent[];
  selections: SelectionMap;
  onEventClick: (event: PolymarketEvent) => void;
}) {
  return (
    <div>
      {events.map((event) => {
        const selection = selections[event.slug];

        return (
          <div
            key={event.slug}
            onClick={() => onEventClick(event)}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontWeight: 600 }}>{event.title}</div>

            {selection ? (
              <div style={{ color: "green" }}>{selection.groupItemTitle}</div>
            ) : (
              <div style={{ color: "#999" }}>Tap to choose</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MarketSelectModal({
  event,
  onClose,
  onSelect,
}: {
  event: PolymarketEvent;
  onClose: () => void;
  onSelect: (market: Market) => void;
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{event.title}</h2>

        {event.markets.map((market, i) => (
          <div
            key={i}
            onClick={() => onSelect(market)}
            style={{
              padding: 12,
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{market.groupItemTitle}</span>

            <span>{(market.lastTradePrice * 100).toFixed(0)}%</span>
          </div>
        ))}

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
