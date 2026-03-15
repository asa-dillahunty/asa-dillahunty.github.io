import { useEffect, useState } from "react";
import PageContainer from "../../PageContainer";
import { useNavigate, useParams } from "react-router-dom";
import { PolymarketEvent } from "./polymarketFuncs";
import { addEventToMarketGame, getMarketGameById } from "./firebaseFuncs";
import AddEventModal from "./AddEventModal";

export default function SideBetHosting() {
  const { lobbyId } = useParams();
  const nav = useNavigate();

  const [currentEvents, setCurrentEvents] = useState<PolymarketEvent[]>([]);
  const [showModal, setShowModal] = useState(false);

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
      </main>

      {showModal && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddEvent}
        />
      )}
    </PageContainer>
  );
}
