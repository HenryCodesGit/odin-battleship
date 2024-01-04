import testFunction from './testFunction';

test('Confirm test works', ()=>{
    expect(testFunction(1,2)).toBe(3);
})

test('Confirm test fails', ()=>{
    expect(testFunction(1,2)).toBe(44);
})