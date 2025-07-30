import { useEffect, useRef, useState } from "react";
import { SudokuInputBar } from "./SudokuInputGrid";
import { SudokuGrid } from "./SudokuGrid";
import { SudokuInfoBar } from "./SudokuInfoBar";

const infoHeightRatio = 0.15;
const gridHeightRatio = 0.6;
const inputHeightRatio = 0.25;

function Sudoku() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sudokuBoard, setSudokuBoard] = useState<null | SudokuGrid>(null);
  const [sudokuInfo, setSudokuInfo] = useState<null | SudokuInfoBar>(null);
  const [sudokuInput, setSudokuInput] = useState<null | SudokuInputBar>(null);

  function handleClick(event: React.MouseEvent) {
    if (!canvasRef?.current || !sudokuBoard) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const clickedX = event.clientX - canvasRect.left;
    const clickedY = event.clientY - canvasRect.top;

    // what did I click?
    for (const part of [sudokuBoard, sudokuInfo, sudokuInput]) {
      if (!part) continue;
      if (
        clickedX > part.x &&
        clickedX < part.x + part.width &&
        clickedY > part.y &&
        clickedY < part.y + part.height
      ) {
        part.clickWithin(clickedX - part.x, clickedY - part.y);
      }
    }
    for (const part of [sudokuBoard, sudokuInfo, sudokuInput]) {
      if (!part) continue;
      part.draw(ctx);
    }
  }

  useEffect(() => {
    if (sudokuBoard === null && canvasRef?.current) {
      // I want the canvas to take up the whole height
      //  'info' bar takes up 10% of the height at the top
      //  'grid' the playing space takes up 70%
      //  'input' the input space where you select your number takes up 20%
      //
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const boardWidth = canvasRef.current.height * gridHeightRatio;
      const xLeft = (canvasRef.current.width - boardWidth) / 2;

      const newInfo = new SudokuInfoBar(
        xLeft,
        0,
        boardWidth,
        canvasRef.current.height * infoHeightRatio
      );
      setSudokuInfo(newInfo);

      const newGrid = new SudokuGrid(
        xLeft,
        canvasRef.current.height * infoHeightRatio,
        boardWidth
      );
      setSudokuBoard(newGrid);

      const newInput = new SudokuInputBar(
        xLeft,
        canvasRef.current.height * (infoHeightRatio + gridHeightRatio),
        boardWidth,
        canvasRef.current.height * inputHeightRatio
      );
      setSudokuInput(newInput);

      newGrid.draw(ctx);
      newInfo.draw(ctx);
      newInput.draw(ctx);
    }
  }, [sudokuBoard, canvasRef]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        onClick={handleClick}
      />
    </div>
  );
}

export default Sudoku;

export enum squareState {
  default,
  selected,
  highlighted,
  revealed,
  wrong,
}
