import { Square } from "./Square"

export function WinnerModal ({ resetGame, winner }) {
  if (winner === null)
    return null
  const winnerText = winner === false ? 'Tie' : 'Won'
  return (
    <section className='winner'>
      <div>
        <h2>
          {winnerText}
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