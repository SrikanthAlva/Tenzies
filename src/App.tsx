import { useEffect, useState } from 'react';
import './App.css';
import Die from './components/Die';
import {nanoid} from "nanoid";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti'

function App() {
  const { width, height } = useWindowSize()
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(1);
  const [topScore, setTopScore] = useState(() => JSON.parse(localStorage.getItem("topScore")!) || 1000);
  const [newTopScore, setNewTopScore] = useState(false);
  // const [startTime, setStartTime] = useState(Date.now())
  // const [endTime, setEndTime] = useState(0)

  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
  }

  function  allNewDice():any {
    let x = [] ;
    for(let i = 0; i<10; i++ ){
      x.push(generateNewDie());
    }
    return x;
  }

  function rollDice() {
    tenzies && setNewTopScore(false);
    tenzies? 
      setDice(allNewDice()) :
      setDice((prevState:any) =>     
        prevState.map((die:any) => {
          return die.isHeld ? die : generateNewDie()
        })
      );

    tenzies ? setRollCount(1) : setRollCount(count => count + 1)
  }

  useEffect(()=> {
    setTenzies(dice.every((die:any) => die.value === dice[0].value && die.isHeld))
  }, [dice])

  useEffect(()=> {
      if(tenzies){
        const topRollCount = JSON.parse(localStorage.getItem("topScore")!) ;
        console.log("topScore ", topRollCount);
        console.log("rollCount ", rollCount);

        if(!topRollCount || rollCount < topRollCount){
          localStorage.setItem("topScore", JSON.stringify(rollCount))
          setTopScore(rollCount)
          setNewTopScore(true);
        } 

        // setEndTime(Date.now())
      }
  },[tenzies])

  // useEffect(()=>{
  //   console.log(endTime - startTime);
  // },[endTime])

  function holdDice(id:any){
    setDice((prevState:any) => 
      prevState.map((dice:any) => {
        return (dice.id === id)? {...dice, isHeld: !dice.isHeld} : dice;        
      })
    )
  }

  return (
    <main>
        {newTopScore && <Confetti width={width*0.99} height={height*0.99} numberOfPieces={100}/>}
        <h1 className='header'>Tenzies</h1>
        <a className='sub-header' href='https://subtlecrypto.substack.com/'>By Subtle_Crypto</a>
        <p className='descrip'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        {!tenzies && <p className='roll-count'>Roll Count: <span className='bold'>{rollCount} </span></p>}
        <div className='dice-container' onClick={allNewDice}>
          {dice.map((dice:any) => {
            return (<Die value={dice.value} key={dice.id} isHeld={dice.isHeld} holdDice={() => holdDice(dice.id)}/>)
          })}
        </div>
        {tenzies && <p className='your-score'>Your Score: <span className='bold'>{rollCount}</span></p>}
        {topScore !== 1000 && <p className='top-score'>Top Score: <span className='bold'>{topScore}</span></p>}
        <input type="button" onClick={rollDice} value={tenzies? "New Game" : "Roll"} className='roll-btn'/>
    </main>)
}
export default App