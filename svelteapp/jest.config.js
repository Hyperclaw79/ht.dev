export default {
    testMatch: [
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/?(*.)+(spec|test).svelte"
    ],
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".svelte"],
    transform: {
        "^.+\\.svelte$": ["svelte-jester", { 
            "preprocess": true,
            "debug": false,
            "compilerOptions": {
                "dev": false
            }
        }],
        "^.+\\.js$": "babel-jest"
    },
    moduleNameMapper: {
        "^src/(.*)": "<rootDir>/src/$1",
        "^\\$lib/(.*)": "<rootDir>/src/lib/$1",
        "^\\$app/stores$": "<rootDir>/src/test-mocks/app-stores.js",
        "^\\$app/(.*)": "<rootDir>/src/test-mocks/app-$1.js"
    },
    setupFiles: ["<rootDir>/src/jest-globals.js"],
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.js"],
    moduleFileExtensions: ["js", "svelte"],
    transformIgnorePatterns: [
        "node_modules/(?!(svelte|@testing-library)/)"
    ],
    collectCoverageFrom: [
        "src/**/*.{js,svelte}",
        "!src/**/*.test.{js,svelte}",
        "!src/**/*.spec.{js,svelte}",
        "!src/**/*.test.old.js",
        "!src/test-setup.js",
        "!src/jest-globals.js",
        "!src/app.html"
    ],
    coverageReporters: ["text", "lcov", "html"]
};
