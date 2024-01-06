/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import "../css/index.css";
import Player from "./Player";
import ComputerPlayer from "./ComputerPlayer";
import Ship from './Ship';
import Gameboard from "./Gameboard";

/* ************************* */

const BOARD_SIZE = 10;

const templateCell = document.createElement('div');
templateCell.classList.add('cell');

const templateRow = document.createElement('div');
templateRow.classList.add('row');

const boardElements = {
    player: document.querySelector('.player.board'),
    cpu: document.querySelector('.cpu.board'),
}
window.boardPieces = {
    player: [],
    cpu: [],
};

const keyArray = Object.keys(boardElements);
for(let a = 0; a < keyArray.length ; a+=1){
    for(let i = 0; i < BOARD_SIZE; i+=1){
        const currRow = templateRow.cloneNode();
        for(let j = 0; j<BOARD_SIZE; j+=1){
            const currElement = templateCell.cloneNode();
            currElement.setAttribute('data-x',i);
            currElement.setAttribute('data-y',j);

            // eslint-disable-next-line no-loop-func
            currElement.addEventListener('click', ()=>{
                // All pieces when clicked on call the clickHandler function and pass their info
                clickHandler(keyArray[a],i,j);
            })

            currRow.appendChild(currElement);
        }
        boardElements[keyArray[a]].appendChild(currRow);
    }

}

/* ******************************************************
/* ******************************************************
/* ******************************************************
/* ******************************************************
/* ******************************************************
*/

const playerShips = Object.freeze(['carrier','battleship','cruiser','cruiser','destroyer']);
window.player1Board = new Gameboard(BOARD_SIZE);
window.player2Board = new Gameboard(BOARD_SIZE);
window.player1 = new Player(window.player1Board);
window.player2 = new ComputerPlayer(window.player2Board,BOARD_SIZE);
window.player1.setTargetTo(window.player2);
window.player2.setTargetTo(window.player1);

// Global callback function that will do something when clicked, depending on state of the game
// TODO: Ask player to set up their ships instead of placing them randomly as below
let clickHandler; 

playerShips.forEach((ship) => {
    let placed = false;
    let x;
    let y;
    let placeRandomly;
    let currShip;
    while(!placed){
        currShip = Ship.getShip(ship);
        x = parseInt(Math.random()*BOARD_SIZE,10);
        y = parseInt(Math.random()*BOARD_SIZE,10);
        placeRandomly = Boolean(parseInt(Math.random()*2,10));
        placed = window.player1.placeShip(currShip,x,y,placeRandomly);
    }
    // Then update HTML element for the ship;
    currShip.locations.forEach((location) =>{
        console.log(`${location[0]}, ${location[1]}`);
        document.querySelector(`.player .cell[data-x='${location[1]}'][data-y='${location[0]}']`)
            .classList.add('ship');
    })
    
    
    placed = false;
    while(!placed){
        x = parseInt(Math.random()*BOARD_SIZE,10);
        y = parseInt(Math.random()*BOARD_SIZE,10);
        placeRandomly = Boolean(parseInt(Math.random()*2,10));
        placed = window.player2.placeShip(Ship.getShip(ship),x,y,placeRandomly);
    }
})

clickHandler = function respondToPlayerAttack(key, x, y){
    // Edge case: Clicking on player board does nothing once game starts
    if(key === 'player') return;

    console.log(`Key is: ${key}. Data-x is: ${x}. Data-y is: ${y}`);
    
    const moveStatus = window.player1.attack(x, y);
    console.log(`You attack and the result is... ${moveStatus}`);

    // Edge case: Clicking on an already revealed location does nothing
    if(moveStatus === false) return; 

    // Otherwise, update the DOM elements to show something has been clicked on
    const currentElement = document.querySelector(`.cpu .cell[data-x='${x}'][data-y='${y}']`);
    if(moveStatus === 'miss')
        currentElement.classList.add('miss');
    else 
        currentElement.classList.add('hit');

    if(moveStatus === 'allSunk') alert('You won!');

    // Get the computer's attack
    window.player2.attack(BOARD_SIZE,(xNew,yNew,result)=>{
        console.log(`Data-x is: ${xNew}. Data-y is: ${yNew}, Result is: ${result}`);

        const element = document.querySelector(`.player .cell[data-x='${yNew}'][data-y='${xNew}']`);
        if(result === 'miss')
            element.classList.add('miss');
        else 
            element.classList.add('hit');

            if(result ==='allSunk') alert('You lost!');
    })
}