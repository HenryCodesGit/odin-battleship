/* eslint-disable lines-between-class-members */
export default class Gameboard{
    #array;
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
        
        this.#array = [];
        this.#array.length = size;
        for(let i = 0; i< size; i+=1){
            this.#array[i] = [];
            this.#array[i].length = size;
        }
    }

    placeShip(ship, x, y, placeOnY){
        if(x<0 || x>this.#size-1 || y < 0 || y > this.#size-1) return false;

        let currIndex;
        for(let i = 0; i<ship.length; i+=1){
            currIndex = ((placeOnY) ? y : x) + i;
            if(currIndex >= this.#size) return false;
            this.#array[placeOnY ? x : currIndex][placeOnY ? currIndex : y] = ship;
        }
        return true;
    }
}