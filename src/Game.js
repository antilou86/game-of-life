import React, {useState, useEffect} from 'react';
import Cell from './Cell';
import './Game.css';

const cellSize = 20;
const width = 800;
const height = 600;
const rows = height/cellSize;
const cols = width/cellSize;

const Game = () => {
    const [cells, setCells] = useState([]);
    const [board, setBoard] = useState([]);
    const [lastTouched, setLastTouch] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [interval, setInterval] = useState(100);
    const [timeoutHandler, setTimeoutHandler] = useState()
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
        return board
    }
    
    useEffect(()=> {
        setBoard(makeEmptyBoard())
    },[])

    const calculateNeighbors = (x,y,board) => {
        //returns number of living neighbors
        let count = 0;

        //offset directions for all eight possible neighbors
        const directions = [[-1,-1], [-1,0], [-1,1], [0,1], [1,1], [1,0], [1,-1], [0,-1]]

        //loops through all eight neighbor positions
        for(let i=0; i<directions.length; i++){
            const dir = directions[i]
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            //if board[x1][y1] is within the bounds of the grid, and is set to true
            if(x1 >= 0 && x1 < cols && y1 >= 0 && y1 < rows && board[y1][x1]) {
                count++
            }
        }
        return count
    }

    console.log("board before runIteration()", board)
    const runIteration = () => {
        console.log('running iteration');
        console.log("board inside run iteration", board)
        let newBoard = makeEmptyBoard();
        //loop through board
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++){

                let neighbors = calculateNeighbors(x,y,board)

                //if its a living cell and has two or three neighbors it stays the same
                if(board[y][x] && (neighbors===2 || neighbors===3)){
                    newBoard[y][x] = true
                }
                //if a dead cell has three neighbors it resurrects
                else if(!board[y][x] && neighbors===3){
                    newBoard[y][x] = true
                }
                //all other cells die or stay dead
                else {
                    newBoard[y][x] = false
                }
            }
        }
        setBoard(newBoard)
        setCells(makeCells())
        setTimeoutHandler(window.setTimeout(()=>{runIteration()}, interval))
    }
    const startGame = () => {
        setIsRunning(true);
        runIteration();
    }

    const stopGame = () => {
        setIsRunning(false)
        if (timeoutHandler) {
            window.clearTimeout(timeoutHandler);
            setTimeoutHandler(null);
        }
    }

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
            let updateBoard = [...board]
            const lastY = lastTouched[lastTouched.length-1].y
            const lastX = lastTouched[lastTouched.length-1].x
            updateBoard[lastY][lastX]=!updateBoard[lastY][lastX]
            setBoard(updateBoard)            
            setLastTouch(prevTouched => (prevTouched.slice(0,prevTouched.length-2)))
        }

        else if(x >= 0 && x <= cols && y >= 0 && y <= rows) {
            let updateBoard = [...board]
            updateBoard[y][x] =!updateBoard[y][x]
            setBoard(updateBoard)
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