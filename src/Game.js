import React from 'react';
import './Game.css';

const cellSize = 20;
const width = 800;
const height = 600;

const Game = () => {

    return(
        <>
        <div className = "Board" style={{width:width, height:height, backgroundSize:`${cellSize}px ${cellSize}px`}}></div>
        </>
    ) 
}

export default Game;