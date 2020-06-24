import React, {useState, useEffect} from 'react';
import Cell from './Cell';
import './Game.css';

const cellSize = 20;
const width = 800;
const height = 600;
const rows = height/cellSize;
const cols = width/cellSize;


//the actual functional component, ayyyyy
const Game = () => {
    const [cells, setCells] = useState([]);
    const [board, setBoard] = useState([]);
    const [lastTouched, setLastTouch] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [interval, setInterval] = useState(100);

    const runIteration = () => {
        console.log('running iteration')
    }
    const startGame = () => {
        setIsRunning(true);
        runIteration();
    }

    const stopGame = () => {
        setIsRunning(false)
        if (timeoutHandler) {
            window.clearTimeout(timeoutHandler);
            timeoutHandler=null;
        }
    }
    
    const handleIntervalChange= (e) => {
        setInterval(e.target.value)
    }

    const makeEmptyBoard = () => {
        let board = []
        //creates empty arrays equal to number of rows.
        for(let y=0; y<rows; y++){
            board[y] =[];
            //populates those with columns
            for(let x=0; x<cols; x++){
                board[y][x] = false;
            }
        }
        console.log("what makeEmptyBoard() returns", board)
        setBoard(board)
    }

    useEffect(()=> {
        makeEmptyBoard()
    },[])

    //helper function to pull x,y coordinates off of the window
    const getElementOffset = (e) => {
        const rect = e.target.getBoundingClientRect();
        const doc = document.documentElement;
        return {
            x:(rect.left + window.pageXOffset) + doc.clientLeft,
            y:(rect.top + window.pageYOffset) + doc.clientTop,
        }
    }

    //will create cells from the board state. 
    const makeCells = () => {
        let cells = [];
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++){
                if (board.length>1 && board[y][x]){
                    cells.push({ x, y });
                }
            }
        }
        setCells(cells)
    }
    useEffect(()=> {
        makeCells()
    },[board])

    //checks to see where the click is coming from in relation to the board size and screen/window width
    const handleClick = (event) => {
        const elemOffset = getElementOffset(event)
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;
        const x = Math.floor(offsetX / cellSize);
        const y = Math.floor(offsetY / cellSize);
        //if the click falls within our grid (adjusted for window offset) toggle the clicked square between (true|false)
        console.log(x,y)
        console.log(cells)
        console.log("lastTouched1=",lastTouched)
        // lastTouched.push({ x, y })
        setLastTouch(prevTouched => ([...prevTouched, {x,y}]))
        console.log("lastTouched2=",lastTouched)

        if(x===0 && y===0 && (lastTouched[lastTouched.length-1].x !== 0 || lastTouched[lastTouched.length-1].y !==0)) {
            console.log(cells[cells.length-1])
            console.log("before changes",lastTouched)
            setBoard(prevBoard => ([...prevBoard, board[lastTouched[lastTouched.length-1].y][lastTouched[lastTouched.length-1].x] = !board[lastTouched[lastTouched.length-1].y][lastTouched[lastTouched.length-1].x]]))
            setLastTouch(prevTouched => (prevTouched.slice(0,prevTouched.length-2)))
            console.log("before changes",lastTouched)
        }

        else if(x >= 0 && x <= cols && y >= 0 && y <= rows) {
            setBoard(prevBoard => ([...prevBoard, board[y][x] = !board[y][x]]))
        }

    }

    return(
        <>
        <div className = "Board" style={{width:width, height:height, backgroundSize:`${cellSize}px ${cellSize}px`}} onClick={handleClick}>
            {
                cells && cells.map((cel) => {
                    return(<Cell x={cel.x} y={cel.y} cellSize={cellSize} key={`${cel.x},${cel.y}`} />)
                })
            }
        </div>
        <div className="controls">Update every <input value={interval} onChange={handleIntervalChange}/>msec {isRunning? <button className="button" onClick={stopGame}>STOP</button>:<button className="button" onClick={startGame}>START</button>}</div>
        </>
    ) 
}

export default Game;