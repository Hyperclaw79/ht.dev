/**
 * @jest-environment jsdom
 */
import { transpose, mutate, generateGrid, getRandomRotation, getIconData } from '../../../src/routes/components/../../src/routes/components/landing/utils.js';

describe("transpose", () => {
    it("should correctly transpose a matrix", () => {
        const matrix = [[1, 2, 3], [4, 5, 6]];
        const expected = [[1, 4], [2, 5], [3, 6]];
        expect(transpose(matrix)).toEqual(expected);
    });
});

describe("mutate", () => {
    it("should correctly mutate an array of positions", () => {
        const arr = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
        const width = 100;
        const height = 100;
        const mutated = mutate(arr, width, height);
        expect(mutated[0].x).not.toBe(arr[0].x);
        expect(mutated[0].y).not.toBe(arr[0].y);
        expect(mutated[1].x).not.toBe(arr[1].x);
        expect(mutated[1].y).not.toBe(arr[1].y);
    });
});

describe("generateGrid", () => {
    it("should generate a grid with the correct number of items", () => {
        const len = 7;
        const grid = generateGrid(len);
        expect(grid.length).toBe(9);
    });
});

describe("getRandomRotation", () => {
    it("should return a random rotation between -60 and 60", () => {
        const rotation = getRandomRotation();
        expect(rotation).toBeGreaterThanOrEqual(-60);
        expect(rotation).toBeLessThanOrEqual(60);
    });
});

describe("getIconData", () => {
    it("should return an array of icon data", () => {
        const icons = ["test1.png", "test2.png", "test3.png"];
        const iconData = getIconData(icons);
        expect(iconData.length).toBe(3);
        iconData.forEach((data, idx) => {
            expect(data).toMatchObject({
                icon: icons[idx],
                position: { x: expect.any(Number), y: expect.any(Number) },
                rotation: expect.any(Number)
            });
        });
    });
});
