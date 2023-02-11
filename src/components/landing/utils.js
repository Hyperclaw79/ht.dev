import skills from "../../data/skillsMetadata.js";

// Helper functions
const transpose = (matrix) => {
    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}
const mutate = (arr, width, height) => {
    return arr.map((item) => ({
        x: item.x + (Math.random() * (width / 2)),
        y: item.y + (Math.random() * (height / 2)),
    }));
    // return arr;
};

const generateGrid = (len) => {
    const num_rows = Math.ceil(Math.sqrt(len));
    const num_cols = Math.ceil(len / num_rows);
    const width_ranges = Array.from({length: num_rows}, (_, i) => (Math.ceil((window.innerWidth / num_rows) * i)));
    const height_ranges = Array.from({length: num_cols}, (_, i) => (Math.ceil((window.innerHeight / num_cols) * i)));
    const grid = Array.from({length: num_rows}, (_, i) => (
        Array.from({length: num_cols}, (_, j) => (
            {x: width_ranges[i], y: height_ranges[j]}
        ))
    ));
    return mutate(transpose(grid).flat(1), window.innerWidth / num_rows, window.innerHeight / num_cols);
}
const getRandomRotation = () => {
    return Math.floor(Math.random() * 120) - 60;
};

// Global variables
const icons = skills['Technical Skills'].sort(
    () => Math.random() - 0.5
).map((skill) => skill.icon);
const grid = generateGrid(icons.length);

// Generated data
const iconData = icons.map((icon, idx) => {
    return {icon, position: grid[idx], rotation: getRandomRotation()};
});

export default iconData;
