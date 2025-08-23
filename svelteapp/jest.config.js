export default {
    testMatch: [
        "<rootDir>/tests/**/*.test.js",
        "<rootDir>/tests/**/*.test.ts",
        "<rootDir>/tests/**/*.test.jsx",
        "<rootDir>/tests/**/*.test.tsx",
        "<rootDir>/tests/**/*.spec.js",
        "<rootDir>/tests/**/*.spec.ts",
        "<rootDir>/tests/**/*.spec.jsx",
        "<rootDir>/tests/**/*.spec.tsx",
        "<rootDir>/tests/**/*.test.svelte",
        "<rootDir>/tests/**/*.spec.svelte"
    ],
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".svelte"],
    coverageProvider: "v8",
    collectCoverageFrom: [
        "src/**/*.{js,svelte}",
        "!src/**/*.d.ts",
        "!src/test-setup.js"
    ],
    transform: {
        "^.+\\.svelte$": ["svelte-jester", {
            preprocess: true,
            debug: false
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
    setupFilesAfterEnv: ["@testing-library/jest-dom/jest-globals", "<rootDir>/src/test-setup.js"],
    moduleFileExtensions: ["js", "svelte"],
    transformIgnorePatterns: [
        "node_modules/(?!(svelte|@testing-library)/)"
    ],
    coveragePathIgnorePatterns: [
        "node_modules/",
        "src/routes/\\+error\\.svelte",
        "src/test-setup.js"
    ]
};
