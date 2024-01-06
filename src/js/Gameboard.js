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
        return Object.freeze(output);
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
        // Case 1: Co-ordinate is out of the board
        if(x<0 || x>this.#size-1 || y < 0 || y > this.#size-1) return false; 
        // Case 3: Ship placement will result in board overflow
        if((x+ship.length-1) >= this.#size || (y+ship.length-1) >= this.#size) return false;

        // Case 2: Ship exists at the location already
        let currIndex;
        if(JSON.stringify(this.#array[x][y]) !== "{}") return false; 
        for(let i = 0; i<ship.length; i+=1){
            currIndex = ((placeOnY) ? y : x) + i;
            if(JSON.stringify(this.#array[placeOnY ? x : currIndex][placeOnY ? currIndex : y]) !== "{}") return false; 
        }

        // Set currIndex and change which index of the array uses currIndex.
        // Dependent on if placeOnY flag is active
        
        for(let i = 0; i<ship.length; i+=1){
            const xIndex = x + ((placeOnY) ? 0 : i);
            const yIndex = y + ((placeOnY) ? i : 0);
            ship.locations?.push([xIndex, yIndex]);
            Object.assign(this.#array[xIndex][yIndex], {ship});
            if(!this.#ships.find((val) => val === ship)) this.#ships.push(ship);
        }

        return true;
    }

    receiveAttack(x,y){
        // Edge case: Shooting outside the board
        if(x<0 || x>this.#size-1 || y < 0 || y > this.#size-1) throw new Error('Cannot select co-ordinates that are outside the board!'); // Case 1: Out of the board


        const target = this.#array[x][y];
        // Case 1: Do not proceed if position has been hit before
        if(Object.hasOwn(target,'revealed')) return false;

        // Case 2: New position that has not been hit before
        Object.assign(target, {revealed: true})

        // Case 2a: If a target does not exist, return -1 (a miss)
        if(!Object.hasOwn(target, 'ship')) return 'miss'
    
        // Case 2b: Target has a hit function. Call it, then return 1 (a hit)
        target.ship.hit();

        return target.ship.isSunk() ? 'sunk' : 'hit';
    }

    isSunk(){
        if(this.#ships.length === 0) return null;
        return this.#ships.reduce((isAllSunk,currentShip) => isAllSunk && currentShip.isSunk(),true);
    }
}