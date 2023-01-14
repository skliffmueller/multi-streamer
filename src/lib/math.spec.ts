import { add } from "./math";

test('add 2 + 2 = 4', () => {
    expect(add(2, 2)).toBe(4);
});