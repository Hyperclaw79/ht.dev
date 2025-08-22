export default {
    testMatch: [
        "**/tests/**/?(*.)+(spec|test).[jt]s?(x)",
        "**/tests/**/?(*.)+(spec|test).svelte"
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
        "^\\$app/stores$": "<rootDir>/tests/test-mocks/app-stores.js",
        "^\\$app/(.*)": "<rootDir>/tests/test-mocks/app-$1.js",
        "^\\$env/dynamic/private$": "<rootDir>/tests/test-mocks/env-dynamic-private.js",
        "^TagCloud$": "<rootDir>/tests/test-mocks/tagcloud.js"
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/jest-globals", "<rootDir>/tests/test-setup.js"],
    moduleFileExtensions: ["js", "svelte"],
    transformIgnorePatterns: [
        "node_modules/(?!(svelte|@testing-library)/)"
    ],
    coveragePathIgnorePatterns: [
        "node_modules/",
        "src/routes/\\+error\\.svelte"
    ]
};
