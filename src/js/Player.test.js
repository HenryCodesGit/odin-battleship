/* eslint-disable no-undef */
import Player from './Player'
import Gameboard from './Gameboard';
import Ship from './Ship';

const BOARD_SIZE = 10;
let board1;
let board2;
let player1;
let player2;

test('Player initiates properly', ()=>{
    board1 = new Gameboard(BOARD_SIZE);

    // eslint-disable-next-line no-new
    expect(()=>{new Player(board1)}).not.toThrow();
})

test('Player can place their ships', ()=>{
    board1 = new Gameboard(BOARD_SIZE);
    player1 = new Player(board1);
    player1.placeShip(Ship.getShip('carrier'),1,1)

    expect(board1.array[1][1]).not.toStrictEqual({});
})

test('Player can target another player to attack', () =>{
    board1 = new Gameboard(BOARD_SIZE);
    player1 = new Player(board1);

    board2 = new Gameboard(BOARD_SIZE);
    player2 = new Player(board2);

    // When target is successful, return true
    expect(player1.setTargetTo(player2)).toBe(true);
})

describe('Player can attack another player', () =>{

    test('Return truthy if attack worked', () => {
        board1 = new Gameboard(BOARD_SIZE);
        player1 = new Player(board1);
    
        board2 = new Gameboard(BOARD_SIZE);
        player2 = new Player(board2);
    
        const location = [1,1];
    
        // When attack is successful, function should return something
        player1.setTargetTo(player2);
        expect(player1.attack(...location)).toBeTruthy();
    })

    test('Return "false"" if attacking existing location', () => {
        board1 = new Gameboard(BOARD_SIZE);
        player1 = new Player(board1);
    
        board2 = new Gameboard(BOARD_SIZE);
        player2 = new Player(board2);
    
        const location = [1,1];
    
        // When attack is successful, function should return something
        player1.setTargetTo(player2);
        player1.attack(...location);
        expect(player1.attack(...location)).toBe(false); // Repeat attack should return false
    })

    test('Return different values depending on miss, hit, sunk, or loss', () => {
        board1 = new Gameboard(BOARD_SIZE);
        player1 = new Player(board1);
    
        board2 = new Gameboard(BOARD_SIZE);
        player2 = new Player(board2);
    
        const location = [1,1];
        player1.setTargetTo(player2);

        player2.placeShip(Ship.getShip('destroyer'),3,3)
        player2.placeShip(Ship.getShip('cruiser'),4,4)
        player2.placeShip(new Ship(1),9,9);

        expect(player1.attack(...location)).toBe('miss') // Misses should return as 'miss'
        
        // Destroyer getting sunk
        expect(player1.attack(...[3,3])).toBe('hit'); // Hit should return as 'hit'
        expect(player1.attack(...[4,3])).toBe('sunk'); // Sunk ships should return as 'sunk'

        // Cruiser getting sunk
        expect(player1.attack(...[4,4])).toBe('hit'); // Hit should return as 'hit'
        expect(player1.attack(...[5,4])).toBe('hit'); // Hit should return as 'hit'
        expect(player1.attack(...[6,4])).toBe('sunk'); // Sunk ships should return as 'sunk'

        // Last ship is sunk
        expect(player1.attack(...[9,9])).toBe('allSunk'); // When all ships sunk, return allsunk
    })
})