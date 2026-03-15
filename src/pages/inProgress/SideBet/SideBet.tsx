import { useState } from "react";
import PageContainer from "../../PageContainer";
import { useNavigate } from "react-router-dom";
import MarketGameModal from "./MarketGameModal";

enum SideBetPageState {
  landingPage,
  selectingGame,
}

type SelectMode = "edit" | "play";

export default function SideBet() {
  const [pageState, setPageState] = useState(SideBetPageState.landingPage);
  const [selectMode, setSelectMode] = useState<SelectMode>("edit");

  const nav = useNavigate();

  const openEditModal = () => {
    setSelectMode("edit");
    setPageState(SideBetPageState.selectingGame);
  };

  const openPlayModal = () => {
    setSelectMode("play");
    setPageState(SideBetPageState.selectingGame);
  };

  const onSelectGame = (gameId: string) => {
    if (selectMode === "edit") {
      nav(`./${gameId}`);
    } else {
      nav(`./${gameId}/play`);
    }
  };

  return (
    <PageContainer header="Side Bet">
      <main>
        <button onClick={openEditModal}>Edit Markets</button>
        <button onClick={openPlayModal}>Bet on Markets</button>
      </main>

      {pageState === SideBetPageState.selectingGame && (
        <MarketGameModal
          mode={selectMode}
          onClose={() => setPageState(SideBetPageState.landingPage)}
          onSelect={onSelectGame}
        />
      )}
    </PageContainer>
  );
}
