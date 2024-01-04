import Ship from './Ship';

describe('Ship Constructor Testing', () => {
    test('Average case', ()=>{
        const ship = new Ship(5);
    
        expect(ship.length).toEqual(5);
        expect(ship.numHits).toEqual(0);
        expect(ship.sunk).toEqual(false);
    })
    test('Invalid type', ()=>{
        expect(() => new Ship('hi')).toThrow();
    })
    test('Invalid length (minimum of 1)', ()=>{
        expect(() => new Ship(0)).toThrow();
    })
})

describe('Function Testing', () => {
    test('"hit()" function increments numHits property', ()=>{
        const ship = new Ship(5);
    
        expect(ship.numHits).toEqual(0);
        ship.hit();
        expect(ship.numHits).toEqual(1);
    })
    test('"isSunk()" function returns true when ship hit too many times', () => {
        const ship = new Ship(3);

        expect(ship.isSunk()).toBe(false);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    })
    test('"sunk" property is true when ship hit too many times', () => {
        const ship = new Ship(3);

        expect(ship.sunk).toBe(false);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.sunk).toBe(true);
    })

})

describe('Factory method testing', () => {
   test('Carrier', () =>{
        const ship = Ship.getShip('carrier');
        expect(ship.length).toBe(5);
        expect(ship.type).toBe('carrier');
   })
   test('Battleship', () =>{
    const ship = Ship.getShip('battleship');
    expect(ship.length).toBe(4);
    expect(ship.type).toBe('battleship');
   })
   test('Cruiser', () =>{
    const ship = Ship.getShip('cruiser');
    expect(ship.length).toBe(3);
    expect(ship.type).toBe('cruiser');
   })
   test('Destroyer', () =>{
    const ship = Ship.getShip('destroyer');
    expect(ship.length).toBe(2);
    expect(ship.type).toBe('destroyer');
   })
   test('Invalid Entry', () =>{
    expect(()=>{Ship.getShip('Monkey');}).toThrow(/type/);
   })
   test('Case insensitive', () =>{
    const ship = Ship.getShip('dEsTroYeR');
    expect(ship.length).toBe(2);
    expect(ship.type).toBe('destroyer');
   })
})

