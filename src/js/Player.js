/* eslint-disable lines-between-class-members */
export default class Player {
    #board
    #target;
    
    constructor(board){
        this.#board = board;
    }

    isAlive(){return !this.#board.isSunk();}

    // Returns a censored version of the board to whoever calls it (hides ship if it has not yet been revealed)
    getBoardStatus(){
        const output = [];
        for(let i = 0; i<this.#board.size; i+=1){
            output.push([]);
            for(let j = 0; j<this.#board.size; j+=1){
                let pushToArray = Object.hasOwn(this.#board.array[i][j],'ship') ? 'x' : 'e';
                pushToArray = Object.hasOwn(this.#board.array[i][j],'revealed') ? pushToArray : '-';
                output[i].push(pushToArray)
            }
        }
        return output;
    }

    setTargetTo(player){
        this.#target = player;
        return true;
    }

    attack(x,y){
        return this.#target.receiveAttack(x,y);
    }

    // Public methods to interact with the private board variable
    placeShip(ship,x,y,placeonY = false){
        return this.#board.placeShip(ship,x,y,placeonY);
    }
    
    receiveAttack(x,y){
        const status = this.#board.receiveAttack(x,y);
        return this.#board.isSunk() ? 'allSunk' : status;
    }

}