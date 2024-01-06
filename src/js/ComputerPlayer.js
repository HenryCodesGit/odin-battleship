/* eslint-disable lines-between-class-members */
import Player from "./Player";

export default class ComputerPlayer extends Player{
    #spacesChecked = 0;
    get spacesChecked(){
        return this.#spacesChecked;
    }
    
    #boardSize;

    constructor(board, boardSize){
        super(board);
        this.#boardSize = boardSize;
    }

    // Randomly select a spot. If the attack returns as invalid, just try again
    // Technically this is O(infinity) if it ranomly happens to never pick the right value
    attack(boardSIZE = this.#boardSize){
        const getRandom = () => parseInt(Math.random()*boardSIZE, 10);

        let result = false;
        while(!result){
            result = super.attack(getRandom(),getRandom());
        }
        
        this.#spacesChecked += 1;
        return result; //(this.#spacesChecked < this.#boardSize*this.#boardSize);
    }
}