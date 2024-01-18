import { useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'


const TURNS = {
  X: 'x',
  O: 'o'
}


const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  
  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  )
}

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]


function App () {
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  // null there is no winner, false when exists a tie otherwise true
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }

  const checkWinner = (boardToCheck) => {
    // check all combos
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (boardToCheck[a]
        && boardToCheck[a] === boardToCheck[b]
        && boardToCheck[a] === boardToCheck[c])
      {
        return boardToCheck[a]
      }
    }

    return null;
  }

  const checkEndGame = (boardToCheck) => {
    // check if all positions are different than null
    return boardToCheck.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    // Avoid updated an already filled cell
    if (board[index] || winner) return

    // Update the board 
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard) // async call

    // update turn
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn);

    // check winner
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner) //async call then winner will be not update asap
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // Tie
    }
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset Game</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}>
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      {
        winner !== null && (
          <section className='winner'>
            <div>
              <h2>
                {
                  winner === false
                    ? 'Tie'
                    : 'Winner is ' + winner
                  
                }
              </h2>

              <header className='win'>
                {winner && <Square>{winner}</Square>}
              </header>
              <footer>
                <button onClick={resetGame}>Start Again!</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}



export default App
