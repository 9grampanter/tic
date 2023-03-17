import styles from '@/styles/Home.module.css'
import { useState } from 'react'

const PlayableBox = (props: { index: number; toggleSquare: Function; someoneOwsTic: string; winnerHasBeenDetermined: Boolean, winningLine: any, isDraw: Boolean }) => {
  const { index, toggleSquare, someoneOwsTic, winnerHasBeenDetermined, winningLine, isDraw } = props;
  
  const playingBorderMap: {[key: string]: string} = {
    0: 'border-r-2 border-b-2',
    1: 'border-r-2 border-b-2',
    2: 'border-b-2',
    3: 'border-r-2 border-b-2',
    4: 'border-r-2 border-b-2',
    5: 'border-b-2',
    6: 'border-r-2',
    7: 'border-r-2',
  };

  return (
    <div
      className={`border-white h-32 w-32 flex justify-center items-center 
      ${playingBorderMap[index]} ${winningLine.indexOf(index) > -1 ? styles.winDiv : ''}
      ${isDraw ? styles.draw : ''}`}
      onClick={() => {
        !winnerHasBeenDetermined && toggleSquare(index)
      }}
    >
      <h3
        className='text-8xl'
      >
        {someoneOwsTic ? someoneOwsTic : ''}
      </h3>
    </div>
  );
};

export default function Home() {
  const [scorePlayerX, setScorePlayerX] = useState(0);
  const [scorePlayerO, setScorePlayerO] = useState(0);
  const [winnerFound, setWinnerFound] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [activePlayer, setActivePlayer] = useState('X');
  const [winningLine, setWinningLine] = useState([]);

  const playingSquares: number[] = [1,2,3,4,5,6,7,8,9];

  type PlayingSquaresObj = {
    [key: number]: string;
  };

  const defaultPlayingSquaresObj = {
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
  }

  const [playingSquaresObj, setPlayingSquaresObj] = useState<PlayingSquaresObj>(defaultPlayingSquaresObj);

  const checkForWinningLines = (playingSquaresObj: {[key: number]: string;}) => {
    let winnerFound2 = false;
    let winningCombo = null;

    // Define the possible winning combinations for both 'X' and 'O'
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // X-ways
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Y-ways
      [0, 4, 8], [2, 4, 6] // Diagonal-ways
    ];

    // Loop through the winning combinations and check if any of them match
    for (const combo of winCombos) {
      const [a, b, c] = combo;
      if (playingSquaresObj[a] && playingSquaresObj[a] === playingSquaresObj[b] && playingSquaresObj[a] === playingSquaresObj[c]) {
        winnerFound2 = true;
        
        winningCombo = combo;
        break;
      }
    }
    const isDraw = Object.values(playingSquaresObj).every(square => square);
    isDraw && setIsDraw(true);

    if (winnerFound2) {
      return winningCombo;
    }
    return [];
  }

  function toggleSquare(index: number) {
    // Try to set active square to active player
    if (!playingSquaresObj[index]) {
      setPlayingSquaresObj({
        ...playingSquaresObj,
        [index]: activePlayer,
      });
      
      // Check for winner
      playingSquaresObj[index] = activePlayer;
      const winningLines: any = checkForWinningLines(playingSquaresObj);
      if (winningLines.length > 0) {
        setWinningLine(winningLines);
        setWinnerFound(true);
        activePlayer === 'X' && setScorePlayerX(scorePlayerX + 1);
        activePlayer === 'O' && setScorePlayerO(scorePlayerO + 1);
      } else {
        setActivePlayer(activePlayer === 'X' ? 'O' : 'X');
      }
    }
  }

  return (
    <div className='m-0 p-0 flex justify-center items-center min-h-screen max-h-screen flex-col'>

      <h1 className='mb-4 flex flex-col items-center'>
        Score:
        <span>❌ - <span className='text-lg semi-bold'>{scorePlayerX}</span></span>
        <span>⭕ - <span className='text-lg semi-bold'>{scorePlayerO}</span></span>
      </h1>
      {isDraw && (<h1 className='mb-8'>Draw - No one wins</h1>)}
      {!winnerFound && !isDraw && (<h1 className='mb-8'>{activePlayer === 'X' ? '❌' : '⭕' }&apos;s turn to play: </h1>)}
      {winnerFound && !isDraw && (<h1 className='mb-8'>{activePlayer === 'X' ? '❌' : '⭕'} won! </h1>)}
      <div
        id='playing-feld'
        className={`grid grid-rows-3 grid-cols-3 ${styles.cBoxShadow}`}
      >
        {playingSquares.map((square, index) => (
          <PlayableBox
            key={square}
            index={index}
            someoneOwsTic={playingSquaresObj[index]}
            isDraw={isDraw}
            winnerHasBeenDetermined={winnerFound}
            toggleSquare={toggleSquare}
            winningLine={winningLine}
          />
        ))}
      </div>
      <button
        className='mt-12 bg-transparent hover:bg-neutral-500 text-neutral-300 font-semibold hover:text-white py-2 px-4 border border-neutral-500 hover:border-transparent rounded'
        type="reset"
        onClick={() => {
          setPlayingSquaresObj(defaultPlayingSquaresObj);
          setWinnerFound(false);
          setWinningLine([]);
          setIsDraw(false);
        }}
      >
        Reset game
      </button>
    </div>
  )
}
