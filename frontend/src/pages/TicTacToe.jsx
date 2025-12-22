import { useState, useEffect } from "react";
import { 
  Gamepad2, 
  RotateCcw, 
  Trophy, 
  Sparkles,
  Zap,
  Star,
  Users
} from "lucide-react";

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
};

const Square = ({ value, onClick, isWinning, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
        text-4xl sm:text-5xl md:text-6xl font-bold
        rounded-xl
        transition-all duration-300 ease-out
        flex items-center justify-center
        border-2
        ${isWinning 
          ? 'bg-linear-to-br from-emerald-400 to-teal-500 border-emerald-300 shadow-lg shadow-emerald-500/50 scale-105' 
          : 'bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-105'
        }
        ${value === 'X' ? 'text-primary' : 'text-accent'}
        ${!value && !disabled ? 'cursor-pointer hover:bg-primary/5' : ''}
        ${disabled && !value ? 'cursor-not-allowed opacity-60' : ''}
        active:scale-95
      `}
    >
      {value && (
        <span className={`
          animate-in zoom-in-50 duration-200
          ${isWinning ? 'text-white drop-shadow-lg' : ''}
        `}>
          {value}
        </span>
      )}
    </button>
  );
};

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'ai'
  const [isThinking, setIsThinking] = useState(false);

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winningLine = result?.line || [];
  const isDraw = !winner && squares.every(square => square !== null);

  // AI move logic
  const makeAIMove = (currentSquares) => {
    const emptyIndices = currentSquares
      .map((val, idx) => val === null ? idx : null)
      .filter(val => val !== null);
    
    if (emptyIndices.length === 0) return;

    // Simple AI: Check for winning move, then blocking move, then random
    const checkWinningMove = (player) => {
      for (let i of emptyIndices) {
        const testSquares = [...currentSquares];
        testSquares[i] = player;
        if (calculateWinner(testSquares)?.winner === player) {
          return i;
        }
      }
      return null;
    };

    // Try to win
    let move = checkWinningMove('O');
    
    // Block opponent
    if (move === null) {
      move = checkWinningMove('X');
    }
    
    // Take center
    if (move === null && currentSquares[4] === null) {
      move = 4;
    }
    
    // Take random corner
    if (move === null) {
      const corners = [0, 2, 6, 8].filter(i => currentSquares[i] === null);
      if (corners.length > 0) {
        move = corners[Math.floor(Math.random() * corners.length)];
      }
    }
    
    // Take random available
    if (move === null) {
      move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    const newSquares = [...currentSquares];
    newSquares[move] = 'O';
    setSquares(newSquares);
    setXIsNext(true);
    setIsThinking(false);
  };

  // AI turn effect
  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext && !winner && !isDraw) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        makeAIMove(squares);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, gameMode, winner, isDraw, squares]);

  // Update scores when game ends
  useEffect(() => {
    if (winner) {
      setScores(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    } else if (isDraw) {
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    }
  }, [winner, isDraw]);

  const handleClick = (index) => {
    if (squares[index] || winner || (gameMode === 'ai' && !xIsNext)) return;
    
    const newSquares = [...squares];
    newSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsThinking(false);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const getStatusMessage = () => {
    if (winner) {
      return (
        <span className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent animate-bounce" />
          <span className={winner === 'X' ? 'text-primary' : 'text-accent'}>
            Player {winner} Wins!
          </span>
          <Sparkles className="w-5 h-5 text-accent" />
        </span>
      );
    }
    if (isDraw) {
      return <span className="text-muted-foreground">It's a Draw! 🤝</span>;
    }
    if (isThinking) {
      return (
        <span className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent animate-pulse" />
          AI is thinking...
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2">
        <span className={xIsNext ? 'text-primary' : 'text-accent'}>
          {gameMode === 'ai' && !xIsNext ? 'AI' : `Player ${xIsNext ? 'X' : 'O'}`}'s Turn
        </span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Gamepad2 className="w-4 h-4" />
            Brain Training Game
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Tic Tac Toe
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Challenge yourself with this classic game. Play against a friend or test your skills against the AI!
          </p>
        </div>

        {/* Game Mode Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => { setGameMode('pvp'); resetAll(); }}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${gameMode === 'pvp' 
                ? 'gradient-primary text-primary-foreground shadow-lg' 
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }
            `}
          >
            <Users className="w-5 h-5" />
            2 Players
          </button>
          <button
            onClick={() => { setGameMode('ai'); resetAll(); }}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${gameMode === 'ai' 
                ? 'gradient-primary text-primary-foreground shadow-lg' 
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }
            `}
          >
            <Zap className="w-5 h-5" />
            vs AI
          </button>
        </div>

        {/* Score Board */}
        <div className="flex justify-center gap-4 sm:gap-8 mb-8">
          <div className="text-center p-4 sm:p-6 bg-card border border-border rounded-2xl shadow-card min-w-[100px]">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{scores.X}</div>
            <div className="text-sm text-muted-foreground font-medium">Player X</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-card border border-border rounded-2xl shadow-card min-w-[100px]">
            <div className="text-3xl sm:text-4xl font-bold text-muted-foreground mb-1">{scores.draws}</div>
            <div className="text-sm text-muted-foreground font-medium">Draws</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-card border border-border rounded-2xl shadow-card min-w-[100px]">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-1">{scores.O}</div>
            <div className="text-sm text-muted-foreground font-medium">{gameMode === 'ai' ? 'AI' : 'Player O'}</div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border rounded-full shadow-card text-xl font-display font-semibold text-foreground">
            {getStatusMessage()}
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-8">
          <div 
            className={`
              p-4 sm:p-6 bg-card border border-border rounded-3xl shadow-card
              ${winner ? 'ring-2 ring-emerald-400 ring-offset-4 ring-offset-background' : ''}
              ${isDraw ? 'ring-2 ring-muted-foreground ring-offset-4 ring-offset-background' : ''}
              transition-all duration-500
            `}
          >
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {squares.map((value, index) => (
                <Square
                  key={index}
                  value={value}
                  onClick={() => handleClick(index)}
                  isWinning={winningLine.includes(index)}
                  disabled={!!winner || isDraw || (gameMode === 'ai' && !xIsNext)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-medium text-foreground hover:border-primary/50 hover:shadow-lg transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-6 py-3 bg-destructive/10 border border-destructive/30 rounded-xl font-medium text-destructive hover:bg-destructive/20 transition-all duration-200"
          >
            Reset Scores
          </button>
        </div>

        {/* Game Info */}
        <div className="mt-12 p-6 bg-card border border-border rounded-2xl shadow-card">
          <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            How to Play
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Player X always goes first</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Click on any empty square to place your mark</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Get three in a row (horizontal, vertical, or diagonal) to win!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>If all squares are filled with no winner, it's a draw</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
