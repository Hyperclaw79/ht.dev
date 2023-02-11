export default {
    testMatch: [
        "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    testEnvironment: "jsdom",
    transform: {},
    moduleNameMapper: {
        "^src/(.*)": "<rootDir>/src/$1"
    }
};
