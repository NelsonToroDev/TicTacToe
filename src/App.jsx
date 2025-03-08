import { useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'
import { Square } from './components/Square'
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal'
import { saveGameToStorage, resetGameToStorage } from './storage/index.js'

function App() {
  console.log('render')
  const [board, setBoard] = useState(() => {
    console.log('Initializing board state')
    // Will resume the game if the page was refreshed from browser
    const boardFromStorage = window.localStorage.getItem('board') // Sync call and slow
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    console.log('Initializing turn state')
    // Will resume the game if the page was refreshed from browser
    const turnFromStorage = window.localStorage.getItem('turn') // Sync call and slow
    return turnFromStorage ?? TURNS.X
  })
  
  // null there is no winner, false when exists a tie otherwise true
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetGameToStorage()
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
    setTurn(newTurn)

    //save board
    saveGameToStorage({ board: newBoard, turn: newTurn })

    // check winner
    const newWinner = checkWinnerFrom(newBoard)
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
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          )
        })}
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
