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
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,],
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
        expect(board.array[2][3]).toBe(mockShip);
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
        expect(board.array[5][5]).toBe(mockShip);
        expect(board.array[6][5]).toBe(mockShip);
    })

    test('Disallow board overflow',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {length: 2};
        const location = [9,9];

        // Assume ship is oriented in x-direction
        expect(board.placeShip(mockShip, ...[4,4])).toBe(true); // Barely fits
        expect(board.placeShip(mockShip, ...location)).toBe(false); // Overflows
    })

    test('Allow ship placement in Y-direction',()=>{
        const BOARD_SIZE = 10;
        const board = new Gameboard(BOARD_SIZE);
        const mockShip = {length: 2};
        const location = [4,4];
        const placeOnY = true;

        // Assume ship is oriented in x-direction
        board.placeShip(mockShip,...location,placeOnY);
        expect(board.array[4][4]).toBe(mockShip);
        expect(board.array[4][5]).toBe(mockShip);
    })
})
