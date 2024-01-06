/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import "../css/index.css";
import Player from "./Player";
import ComputerPlayer from "./ComputerPlayer";
import Ship from './Ship';
import Gameboard from "./Gameboard";

const BOARD_SIZE = 10;
const playerShips = Object.freeze(['carrier','battleship','cruiser','cruiser','destroyer']);
window.player1 = new ComputerPlayer(new Gameboard(BOARD_SIZE),BOARD_SIZE);
window.player2 = new ComputerPlayer(new Gameboard(BOARD_SIZE),BOARD_SIZE);
window.player1.setTargetTo(window.player2);
window.player2.setTargetTo(window.player1);

// TODO: Ask player to set up their ships instead of placing them randomly as below
playerShips.forEach((ship) => {
    let placed = false;
    while(!placed) placed = window.player1.placeShip(Ship.getShip(ship),parseInt(Math.random()*BOARD_SIZE,10),parseInt(Math.random()*BOARD_SIZE,10));
    
    placed = false;
    while(!placed) placed = window.player2.placeShip(Ship.getShip(ship),parseInt(Math.random()*BOARD_SIZE,10),parseInt(Math.random()*BOARD_SIZE,10));
})

window.getMove = function getPlayerAttack(){
    const playerMove = {};
    console.log(window.player2.getBoardStatus());
    playerMove.x = prompt(`Which co-ordinate along X would you like to attack?`);
    playerMove.y= prompt(`Which co-ordinate along Y would you like to attack?`);

    const moveStatus = window.player1.attack(playerMove.x, playerMove.y);
    console.log(`You attack and the result is... ${moveStatus}`);
    console.log(window.player2.getBoardStatus());

    return moveStatus === 'allSunk'
}

 window.index = 0;
// Setting up the game loop
while(window.player1.isAlive() && window.player2.isAlive()){
    
    // Get player1's move
    window.player1.attack();
    //window.getMove();

    // Get Player 2's move
    window.player2.attack();
    
    console.log(window.index++);
}

alert('Someone has died!')

