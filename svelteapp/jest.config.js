export default {
    testMatch: [
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/?(*.)+(spec|test).svelte"
    ],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.svelte$": "svelte-jester"
    },
    moduleNameMapper: {
        "^src/(.*)": "<rootDir>/src/$1"
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
    moduleFileExtensions: ["js", "svelte"]
};
