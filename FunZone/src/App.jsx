import { useState, useEffect } from "react";
import "./App.css";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
      style={{
        color: value === "X" ? "#ff6b6b" : "#4ecdc4",
        animation: value ? "pop 0.2s ease" : "none",
      }}
    >
      {value}
    </button>
  );
}

export default function App() {
  const [isNextX, setIsNextX] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [difficulty, setDifficulty] = useState("hard");
  const [winningLine, setWinningLine] = useState([]);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((sq) => sq !== null);

  // Update winning line
  useEffect(() => {
    if (winner) {
      setWinningLine(getWinningLine(squares));
    } else {
      setWinningLine([]);
    }
  }, [winner, squares]);

  // AI Move
  useEffect(() => {
    if (!isNextX && !winner) {
      const timer = setTimeout(() => {
        let move;

        if (difficulty === "easy") {
          move = getRandomMove(squares);
        } else if (difficulty === "medium") {
          move =
            Math.random() < 0.5
              ? getBestMove(squares)
              : getRandomMove(squares);
        } else {
          move = getBestMove(squares);
        }

        setSquares((prevSquares) => {
          if (prevSquares[move] || calculateWinner(prevSquares)) return prevSquares;

          const nextSquares = prevSquares.slice();
          nextSquares[move] = "O";
          return nextSquares;
        });

        setIsNextX(true);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isNextX, squares, winner, difficulty]);

  function handleClick(i) {
    if (squares[i] || winner || !isNextX) return;

    const nextSquares = squares.slice();
    nextSquares[i] = "X";

    setSquares(nextSquares);
    setIsNextX(false);
  }

  function restartGame() {
    setSquares(Array(9).fill(null));
    setIsNextX(true);
    setWinningLine([]);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner + " 🎉";
  } else if (isDraw) {
    status = "It's a Draw 😐";
  } else {
    status = "Next player: " + (isNextX ? "X" : "O");
  }

  return (
    <div className="game-container">
      <h2>{status}</h2>

      {/* Difficulty Selector */}
      <div className="difficulty">
        <label>Difficulty: </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy 🎲</option>
          <option value="medium">Medium ⚖️</option>
          <option value="hard">Hard 💀</option>
        </select>
      </div>

      {/* Board */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} highlight={winningLine.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} highlight={winningLine.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} highlight={winningLine.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} highlight={winningLine.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} highlight={winningLine.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} highlight={winningLine.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} highlight={winningLine.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} highlight={winningLine.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} highlight={winningLine.includes(8)} />
      </div>

      <button className="restart-btn" onClick={restartGame}>
        Restart Game 🔄
      </button>
    </div>
  );
}

// Helper Functions

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return [];
}

// Random Move (Easy)
function getRandomMove(squares) {
  const empty = squares.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// Minimax Functions (Hard / Medium)
function getBestMove(squares) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = "O";
      let score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}   


function minimax(board, depth, isMaximizing) {
  const winner = calculateWinner(board);

  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every((sq) => sq !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}