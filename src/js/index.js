/* eslint-disable prefer-const */
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
const playerShips = Object.freeze(['carrier','battleship','cruiser','cruiser','destroyer']);

let clickHandler = () => {}; 
let mouseOverHandler = () => {};
let rightClickHandler = () => {};

let player1Board;
let player2Board;
let player1;
let player2;

/* ************************* */

const templateCell = document.createElement('div');
templateCell.classList.add('cell');

const templateRow = document.createElement('div');
templateRow.classList.add('row');

const boardElements = {
    player: document.querySelector('.player.board'),
    cpu: document.querySelector('.cpu.board'),
}
boardElements.cpu.classList.add('hidden');
const keyArray = Object.keys(boardElements);
// const boardPieces = {
//     player: [],
//     cpu: [],
// };


const gameStartModal = document.querySelector('.game-start'); gameStartModal.showModal();
gameStartModal.querySelector('button').onclick = () => { 
    resetBoard(); 
    startNewGame();
    gameStartModal.close();
}

const gameOverModal = document.querySelector('.game-over'); gameOverModal.close();
gameOverModal.querySelector('button').onclick = () => { 
    resetBoard();
    gameOverModal.close();
    gameStartModal.showModal();  
}


/*
/* ******************************************************
/* ******************************************************
/* ******************************************************
/* ******************************************************
/* ******************************************************
*/

function resetBoard(){
    // Hide the CPU board again so the player can place their pieces
    boardElements.cpu.classList.add('hidden');
    
    // Delete old grid
    while(boardElements.cpu.lastElementChild){
        boardElements.cpu.removeChild(boardElements.cpu.lastChild);
    }

    while(boardElements.player.lastElementChild){
        boardElements.player.removeChild(boardElements.player.lastChild);
    }
    
    // Make new grid
    for(let a = 0; a < keyArray.length ; a+=1){
        for(let i = 0; i < BOARD_SIZE; i+=1){
            const currRow = templateRow.cloneNode();
            for(let j = 0; j<BOARD_SIZE; j+=1){
                const currElement = templateCell.cloneNode();
                currElement.setAttribute('data-x',i);
                currElement.setAttribute('data-y',j);

                // All pieces when clicked on call the clickHandler function and pass their info
                // eslint-disable-next-line no-loop-func        
                currElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    clickHandler(keyArray[a],i,j)
                });
                // eslint-disable-next-line no-loop-func
                currElement.addEventListener('mouseover', (e) => {
                    e.preventDefault();
                    mouseOverHandler(keyArray[a],i,j);
                });
                currElement.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    rightClickHandler(keyArray[a],i,j);
                });

                currRow.appendChild(currElement);
            }
            boardElements[keyArray[a]].appendChild(currRow);
        }
    } 
}

function startNewGame(){
    player1Board = new Gameboard(BOARD_SIZE);
    player2Board = new Gameboard(BOARD_SIZE);
    player1 = new Player(player1Board);
    player2 = new ComputerPlayer(player2Board,BOARD_SIZE);
    player1.setTargetTo(player2);
    player2.setTargetTo(player1);

    placeCPUShips();
    placeHumanShips();
}

function placeCPUShips(){
    playerShips.forEach((ship) => {
        let placed = false;
        let x;
        let y;
        let placeRandomly;
                
        while(!placed){
            x = parseInt(Math.random()*BOARD_SIZE,10);
            y = parseInt(Math.random()*BOARD_SIZE,10);
            placeRandomly = Boolean(parseInt(Math.random()*2,10));
            placed = player2.placeShip(Ship.getShip(ship),x,y,placeRandomly);
        }
    })
}

function placeHumanShips(ships = playerShips, currentIndex = 0) {
    // Exit condition
    if(currentIndex >= ships.length){
      boardElements.cpu.classList.remove('hidden');
      clickHandler = respondToPlayerAttack;
      mouseOverHandler = ()=>{};
      rightClickHandler = ()=>{};
      return;
    }

    // Get the current ship to instantiate
    let currShip = Ship.getShip(ships[currentIndex]);
    let placeOnX = false;

    // Need to use function binding because handler arguments have been predefined already in the grid instantiation
    mouseOverHandler = highlightShipCells.bind({length: currShip.length, placeOnX});
    clickHandler = clickPlaceShip.bind({currShip, ships, currentIndex, placeOnX});
    rightClickHandler = (key, x, y) => {
        console.log('hi');
        placeOnX = !placeOnX;
        mouseOverHandler = highlightShipCells.bind({length: currShip.length, placeOnX})
        clickHandler = clickPlaceShip.bind({currShip, ships, currentIndex, placeOnX});
        mouseOverHandler.call({length: currShip.length, placeOnX},key,x,y)
    }
}

function gameOver(winner){
    clickHandler = () => {
        console.log('Currently disabled');
    }
    gameOverModal.querySelector('p').textContent = `Game over! The winner is the ${winner}`;
    gameOverModal.showModal();
}

function respondToPlayerAttack(key, x, y){
    // Edge case: Clicking on player board does nothing once game starts
    if(key === 'player') return;

    console.log(`Key is: ${key}. Data-x is: ${x}. Data-y is: ${y}`);
    
    const moveStatus = player1.attack(x, y);
    console.log(`You attack and the result is... ${moveStatus}`);

    // Edge case: Clicking on an already revealed location does nothing
    if(moveStatus === false) return; 

    // Otherwise, update the DOM elements to show something has been clicked on
    const currentElement = document.querySelector(`.cpu .cell[data-x='${x}'][data-y='${y}']`);
    if(moveStatus === 'miss')
        currentElement.classList.add('miss');
    else 
        currentElement.classList.add('hit');

    if(moveStatus === 'allSunk'){
        console.log('The player won!');
        gameOver('player');
        return;
    }

    // Get the computer's attack
    player2.attack(BOARD_SIZE,(xNew,yNew,result)=>{
        console.log(`Data-x is: ${xNew}. Data-y is: ${yNew}, Result is: ${result}`);

        const element = document.querySelector(`.player .cell[data-x='${yNew}'][data-y='${xNew}']`);
        if(result === 'miss')
            element.classList.add('miss');
        else 
            element.classList.add('hit');

            if(result ==='allSunk'){
                console.log('The computer won!');
                gameOver('computer');
            }
    })

}

function highlightShipCells(key,x,y){
    // 
    const highlightInformation = this;  // Note: 'this' is passed in through function binding

    // First, un-highlight all other existing cells
    boardElements[key].querySelectorAll('[data-x][data-y]').forEach(cell => cell.classList.remove('temp-ship'));

    // Highlight the currently selected cell
    boardElements[key].querySelector(`[data-x='${x}'][data-y='${y}']`).classList.add('temp-ship');

    // Highlight neighbours up to the length of the ship
    for(let i = 0; i < highlightInformation.length ; i+=1){
        let currX = x + ((highlightInformation.placeOnX) ? i : 0);
        let currY = y + (!(highlightInformation.placeOnX) ? i : 0);
        boardElements[key].querySelector(`[data-x='${currX}'][data-y='${currY}']`)?.classList.add('temp-ship');
    }
    
}

function clickPlaceShip(_, y, x){

    console.log(`The current ship is ${this.currShip.length}`);
    console.log(`Requesting to put it at ${x},${y}`);

    let validPlacement = player1.placeShip(
        this.currShip,
        x,
        y,
        this.placeOnX
    );

    this.currShip.locations.forEach((location) =>{
        document.querySelector(`.player .cell[data-x='${location[1]}'][data-y='${location[0]}']`)
            .classList.add('ship');
    })

    if(validPlacement){placeHumanShips(this.ships, this.currentIndex+1)}
    else placeHumanShips(this.ships, this.currentIndex);
}