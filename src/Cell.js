import React from 'react';
import './Game.css';


const Cell = (props) => {
    const {x, y, cellSize} = props;
    
    return(
        <div className="Cell" style={{left: `${cellSize * x + 1}px`, top: `${cellSize * y + 1}px`, width: `${cellSize - 1}px`, height: `${cellSize + 1}px` }}></div>
    );
}

export default Cell;