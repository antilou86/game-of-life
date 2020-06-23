import React, {useState} from 'react';
import Cell from './Cell';
import './Game.css';

const cellSize = 20;
const width = 800;
const height = 600;
const rows = height/cellSize;
const cols = width/cellSize;

const makeEmptyBoard = () => {
    let board = []
    //creates empty arrays equal to number of rows.
    for(let y; y<rows; y++){
        board[y] =[];
        //populates those with columns
        for(let x; x<cols; x++){
            board[x][y] = false;
        }
    }
    return board
}
const board = makeEmptyBoard()

//helper function to pull x,y coordinates off of the window
const getElementOffset = () => {
    const rect = getBoundingClientRect();
    const doc = document.documentElement;
    return {
        x:(rect.left + window.pageXOffset) + doc.clientLeft,
        y:(rect.top + window.pageYOffset) + doc.clientTop,
    }
}

//will create cells from the board state. 
const makeCells = () => {
    let cells = [];
    for(let y; y<rows; y++) {
        for(let x; x<cols; x++){
            if (board[x][y]){
                cells.push({x, y});
            }
        }
    }
    return cells
}

//the actual functional component, ayyyyy
const Game = () => {
    const [cells, setCells] = useState({cells:[]});

    //checks to see where the click is coming from in relation to the board size and screen/window width
    const handleClick = (event) => {
        const elemOffset = getElementOffset()
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientTop - elemOffset.y;
        const x = Math.floor(offsetX / cellSize);
        const y = Math.floor(offsetY / cellSize);
        //if the click falls within our grid (adjusted for window offset) toggle the clicked square ()
        if(x >= 0 && x <= cols && y >= 0 && y <= rows) {
            board[y][x] = !board[y][x];
        }

        setCells({ cells: makeCells() })

    }
    return(
        <>
        <div className = "Board" style={{width:width, height:height, backgroundSize:`${cellSize}px ${cellSize}px`}} onClick={handleClick} ref={(n) => { boardRef = n; }}></div>
        </>
    ) 
}

export default Game;