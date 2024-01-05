/* eslint-disable lines-between-class-members */
export default class Gameboard{
    #array = [];
    #ships = [];

    // Return a copy of the array two levels deep;
    get array(){
        const output = [];
        output.length = this.#size;
        for(let i = 0; i<output.length; i+=1){
            output[i] = [...this.#array[i]];
        }
        return output;
    }

    #size;
    get size(){ return this.#size}

    constructor(size){
        this.#size = size;
        
        for(let i = 0; i< size; i+=1){
            this.#array.push([]);
            for(let j = 0; j<size; j+=1){
                this.#array[i].push({});
            }
        }
    }

    placeShip(ship, x, y, placeOnY){
        // Edge conditions
        if(x<0 || x>this.#size-1 || y < 0 || y > this.#size-1) return false; // Case 1: Out of the board
        if(JSON.stringify(this.#array[x][y]) !== "{}") return false; // Case 2: Ship exists at the location already

        // Set currIndex and change which index of the array uses currIndex.
        // Dependent on if placeOnY flag is active
        let currIndex;
        for(let i = 0; i<ship.length; i+=1){
            currIndex = ((placeOnY) ? y : x) + i;
            if(currIndex >= this.#size) return false;

            this.#array[placeOnY ? x : currIndex][placeOnY ? currIndex : y] = ship;
            this.#ships.push(ship);
        }

        return true;
    }

    receiveAttack(x,y){
        // Edge case: Shooting outside the board
        if(x<0 || x>this.#size-1 || y < 0 || y > this.#size-1) throw new Error('Cannot select co-ordinates that are outside the board!'); // Case 1: Out of the board

        // Case 1: Empty spot
        // Initiate the array if it has not yet been.
        const target = this.#array[x][y];

        // Case 2: Do not proceed if position has been hit before
        if(Object.hasOwn(target,'revealed')) return false;

        // Case 3: Hit the position.
        if(target.hit) target.hit(); // If a target exists, call its hit function

         // Assign new property denoting this spot has been targeted before
        Object.assign(target, {revealed: true})
        return true;
    }

    isSunk(){
        if(this.#ships.length === 0) throw new Error('The board is currently empty and has no ships!');
        return this.#ships.reduce((isAllSunk,currentShip) => isAllSunk && currentShip.isSunk(),true);
    }
}