export default {
    testMatch: [
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/?(*.)+(spec|test).svelte"
    ],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.svelte$": ["svelte-jester", { 
            "preprocess": true,
            "debug": false,
            "compilerOptions": {
                "dev": false
            }
        }]
    },
    moduleNameMapper: {
        "^src/(.*)": "<rootDir>/src/$1",
        "^\\$lib/(.*)": "<rootDir>/src/lib/$1",
        "^\\$app/(.*)": ["<rootDir>/src/app/$1", "<rootDir>/.svelte-kit/dev/runtime/app/$1"]
    },
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.js"],
    moduleFileExtensions: ["js", "svelte"],
    extensionsToTreatAsEsm: [".svelte"],
    transformIgnorePatterns: [
        "node_modules/(?!(svelte|@testing-library)/)"
    ],
    collectCoverageFrom: [
        "src/**/*.{js,svelte}",
        "!src/**/*.test.{js,svelte}",
        "!src/**/*.spec.{js,svelte}",
        "!src/**/*.test.old.js",
        "!src/test-setup.js",
        "!src/app.html"
    ],
    coverageReporters: ["text", "lcov", "html"],
    globals: {
        'js-jest': {
            useESM: true
        }
    }
};
