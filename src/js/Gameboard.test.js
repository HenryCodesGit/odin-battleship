/* eslint-disable no-undef */
import Gameboard from './Gameboard';

describe('Gameboard constructor testing', () => {
    test('"size" property is instantiated', ()=>{
        const board = new Gameboard(10);
        expect(board.size).toBe(10);
    })
    test('"gameboard array is instantiated', ()=>{
        const board = new Gameboard(10);
        // Empty 10 by 10 array.
        expect(board.array).toEqual(
            [
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
                [{},{},{},{},{},{},{},{},{},{}],
            ]
        );
    })
})

describe('"placeShip" function testing', () => {
    test('Place ship reference at a co-ordinate location',()=>{
        const board = new Gameboard(10);
        const mockShip = {length: 5}
        const location = [2,3]

        // Board to return true if the placement is successful
        expect(board.placeShip(mockShip, ...location)).toBe(true);
        expect(board.array[2][3].ship).toBe(mockShip);
    })

    test('Invalid locations returns false',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {length: 5}

        // Board to return false if the placement is invalid
        expect(board.placeShip(mockShip, ...[-1,1])).toBe(false);
        expect(board.placeShip(mockShip, ...[1,BOARD_SIZE+1])).toBe(false);
        expect(board.placeShip(mockShip, ...[BOARD_SIZE+1,1])).toBe(false);
    })

    test('Ships occupy multiple squares of space',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {length: 2};
        const location = [5,5];

        // Assume ship is oriented in x-direction
        board.placeShip(mockShip,...location);
        expect(board.array[5][5].ship).toBe(mockShip);
        expect(board.array[6][5].ship).toBe(mockShip);
    })

    test('Disallow board overflow',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {length: 6};
        const location = [9,9];

        // Assume ship is oriented in x-direction
        expect(board.placeShip(mockShip, ...[4,4])).toBe(true); // Barely fits
        expect(board.array[4][4].ship).toBe(mockShip) // Board should not have placed part of the ship if it overflows
        expect(board.placeShip(mockShip, ...location)).toBe(false); // Overflows
        expect(board.array[9][9]).toStrictEqual({}) // Board should not have placed part of the ship if it overflows
    })

    test('Allow ship placement in Y-direction',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {length: 2};
        const location = [4,4];
        const placeOnY = true;

        // Assume ship is oriented in x-direction
        board.placeShip(mockShip,...location,placeOnY);
        expect(board.array[4][4].ship).toBe(mockShip);
        expect(board.array[4][5].ship).toBe(mockShip);
    })

    test('Disallow ship overlapping',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {length: 2};
        const location = [4,4];
        const placeOnY = true;

        const mockShip2 = {length: 2};
        const location2 = [4,5];

        // Assume ship is oriented in x-direction
        board.placeShip(mockShip,...location,placeOnY);
        expect(board.placeShip(mockShip2,...location2,placeOnY)).toBe(false);
    })
})

describe('"receiveAttack" function testing', ()=>{

    test('Hit an active ship', () => {
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {
            hit(){return true;},
            isSunk(){return false},
            length: 2,
        };
        const location = [4,4];
        const placeOnY = true;

        board.placeShip(mockShip,...location,placeOnY);
        // Attacking location of the ship should register a hit
        expect(board.receiveAttack(4,4)).toBe('hit');
    })

    test('Miss a ship', () => {
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {
            hit(){return true;},
            length: 2,
        };
        const location = [4,4];
        const placeOnY = true;

        board.placeShip(mockShip,...location,placeOnY);
        // Attacking location of the ship should register a hit
        expect(board.receiveAttack(1,1)).toBe('miss');
    })

    test('Cannot shoot the same place twice', () => {
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {
            hit(){return true;},
            isSunk(){return false;},
            length: 2,
        };
        const location = [4,4];
        const placeOnY = true;
        board.placeShip(mockShip,...location,placeOnY);
        board.receiveAttack(4,4);
        
        expect(board.receiveAttack(4,4)).toBe(false); // Attack existing ship

        board.receiveAttack(1,1);
        expect(board.receiveAttack(1,1)).toBe(false); // Attack empty spot twice
    })

    test('Cannot attack spaces outside the board', ()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        expect(()=>{board.receiveAttack(-1,1)}).toThrow(/outside/i);
        expect(()=>{board.receiveAttack(1,-1)}).toThrow(/outside/i);
        expect(()=>{board.receiveAttack(BOARD_SIZE+1,1)}).toThrow(/outside/i);
        expect(()=>{board.receiveAttack(1,BOARD_SIZE+1)}).toThrow(/outside/i);
    })
})

describe('"allShipsSunk" function testing', ()=>{
    test('All ships are sunk', () =>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {
            length: 4, 
            isSunk() {return true}
        }

        board.placeShip(mockShip,1,1);
        expect(board.isSunk()).toBe(true);
    });
    test('Some ships are sunk', () => {
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {
            length: 1, 
            isSunk() {return true}
        };
        const mockShip2 = {
            length: 1, 
            isSunk() {return false}
        };

        board.placeShip(mockShip,1,1);
        board.placeShip(mockShip2,1,2);
        expect(board.isSunk()).toBe(false);
    });
    test('No ships are sunk', () => {
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {
            length: 1, 
            isSunk() {return false}
        };
        const mockShip2 = {
            length: 1, 
            isSunk() {return false}
        };

        board.placeShip(mockShip,1,1);
        board.placeShip(mockShip2,1,2);
        expect(board.isSunk()).toBe(false);
    });
    test('No ships sunk becomes all ship sunk after hit',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {
            length: 1, 
            isSunk() {return true}
        };
        const mockShip2 = {
            length: 1, 
            isSunk() {
                return this.sunk;
            },
            sunk: false,
            hit(){this.sunk = true;}
        };

        board.placeShip(mockShip,1,1);
        board.placeShip(mockShip2,1,2);
        expect(board.isSunk()).toBe(false);
        board.receiveAttack(1,2);
        expect(board.isSunk()).toBe(true);
        
    })
    test('Board is empty', () => {
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);

        expect(board.isSunk()).toBe(null);
    });
})
