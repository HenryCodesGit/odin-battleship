/* eslint-disable no-undef */
import ComputerPlayer from './ComputerPlayer'
import Player from './Player'
import Gameboard from './Gameboard';

const BOARD_SIZE = 10;
let board1;
let board2;
let player1;
let player2;

test('Can attack another player (up until there are no more remaining spots)', ()=>{
    board1 = new Gameboard(BOARD_SIZE);
    player1 = new ComputerPlayer(board1,BOARD_SIZE);
    board2 = new Gameboard(BOARD_SIZE);
    player2 = new Player(board2);

    player1.setTargetTo(player2);

    const timeOut = Date.now()+1000;
    while(player1.spacesChecked < 100 && Date.now() < timeOut){
        player1.attack(BOARD_SIZE);
    };
    
    expect(player1.spacesChecked).toBe(BOARD_SIZE**2);
})