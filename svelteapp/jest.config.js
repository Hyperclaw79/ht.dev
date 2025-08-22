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
            "debug": false
        }]
    },
    moduleNameMapper: {
        "^src/(.*)": "<rootDir>/src/$1",
        "^\\$lib/(.*)": "<rootDir>/src/lib/$1",
        "^\\$app/stores$": "<rootDir>/src/test-mocks/app-stores.js",
        "^\\$app/(.*)": "<rootDir>/src/test-mocks/app-$1.js",
        "^\\$env/dynamic/private$": "<rootDir>/src/test-mocks/env-dynamic-private.js",
        "^TagCloud$": "<rootDir>/src/test-mocks/tagcloud.js"
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/jest-globals", "<rootDir>/src/test-setup.js"],
    moduleFileExtensions: ["js", "svelte"],
    transformIgnorePatterns: [
        "node_modules/(?!(svelte|@testing-library)/)"
    ],
    coveragePathIgnorePatterns: [
        "node_modules/",
        "src/routes/\\+error\\.svelte"
    ]
};
