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
        "^src/(.*)": "<rootDir>/src/$1"
    },
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.js"],
    moduleFileExtensions: ["js", "svelte"],
    extensionsToTreatAsEsm: [".svelte"],
    transformIgnorePatterns: [
        "node_modules/(?!(svelte|@testing-library)/)"
    ]
};
