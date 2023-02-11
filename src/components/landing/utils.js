import skills from "../../data/skillsMetadata.js";

// Helper functions
export const transpose = (matrix) => {
    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
};
export const mutate = (arr, width, height) => {
    return arr.map((item) => ({
        x: item.x + (Math.random() * (width / 2)),
        y: item.y + (Math.random() * (height / 2))
    }));
    // return arr;
};

export const generateGrid = (len) => {
    const numRows = Math.ceil(Math.sqrt(len));
    const numCols = Math.ceil(len / numRows);
    const widthRanges = Array.from({ length: numRows }, (_, i) => (Math.ceil((window.innerWidth / numRows) * i)));
    const heightRanges = Array.from({ length: numCols }, (_, i) => (Math.ceil((window.innerHeight / numCols) * i)));
    const grid = Array.from({ length: numRows }, (_, i) => (
        Array.from({ length: numCols }, (_, j) => (
            { x: widthRanges[i], y: heightRanges[j] }
        ))
    ));
    return mutate(transpose(grid).flat(1), window.innerWidth / numRows, window.innerHeight / numCols);
};
export const getRandomRotation = () => {
    return Math.floor(Math.random() * 120) - 60;
};

// Global variables
const icons = skills["Technical Skills"].sort(
    () => Math.random() - 0.5
).map((skill) => skill.icon);
const grid = generateGrid(icons.length);

// Generated data
const iconData = icons.map((icon, idx) => {
    return { icon, position: grid[idx], rotation: getRandomRotation() };
});

export default iconData;
