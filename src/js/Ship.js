/* eslint-disable lines-between-class-members */
export default class Ship {
    #sunk;
    get sunk() { return this.#sunk; }

    #numHits;
    get numHits() { return this.#numHits };

    #length;
    get length() { return this.#length };

    #type;
    get type() { return this.#type }

    locations = [];

    static #shipTypes = {
        carrier: {length: 5},
        battleship: {length: 4},
        cruiser: {length: 3},
        destroyer: {length: 2},
    }

    constructor(length){
        if(typeof length !== 'number') throw new Error('Ships must be instantiated with a numeric length');
        if(length < 1) throw new Error('Ships must be instantiated with length of at least 1');
        this.#length = length;
        this.#numHits = 0;
        this.#sunk =false;
        
        // Set the type
        Object.keys(Ship.#shipTypes).reduce((keepLooking,property) => {
            if(keepLooking){
                if(Ship.#shipTypes[property].length === length){
                    this.#type = property;
                    return false;
                }
            }

            return keepLooking;
        },true);

        // If type not specified, then its a custom ship 
        if(!this.#type){this.#type = `Custom ship (length ${this.#length})`};
    }

    hit(){
        // Hit the ship
        this.#numHits += 1;

        // Check if it is sunk
        this.isSunk();
    }

    isSunk(){
        this.#sunk = this.numHits >= this.length
        return this.#sunk;
    }

    static getShip(type){
        if(typeof type !== 'string') throw new Error('This function only accepts non-empty strings');
        
        const caseInsensitiveType = type.toLowerCase();
        if(!(Ship.#shipTypes[caseInsensitiveType])) throw new Error('Invalid ship type');
        return new Ship((Ship.#shipTypes[caseInsensitiveType]).length);
    }
}