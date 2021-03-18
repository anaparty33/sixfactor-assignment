module.exports = {
    "moduleDirectories": [
        "node_modules",
        "src/testUtils"
    ],
    "moduleNameMapper": {
        '^base(.*)$': '<rootDir>/src/components/base$1',
        '^header(.*)/$': '<rootDir>/src/components/header/$1',
        '^views(.*)/$': '<rootDir>/src/components/views/$1',
        '^components/(.*)$': '<rootDir>/src/components/$1',
        '^constants/(.*)$': '<rootDir>/src/constants/$1',
        '^assets/(.*)$': '<rootDir>/src/assets/$1',
        '^mock(.*)/$': '<rootDir>/src/mock/$1',
        '^services/(.*)$': '<rootDir>/src/services/$1',
        '^utils/(.*)$': '<rootDir>/src/utils/$1',
        '^styles/(.*)$': '<rootDir>/src/styles/$1',
    },
    "transform": {
        "^.+.js$": "babel-jest",
        ".+\\.(css|style|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$":
          "jest-transform-stub"

    },
    testPathIgnorePatterns: ["<rootDir>/cypress/", "fixtures"],
    collectCoverageFrom: ["src/components/**/*.js", "src/services/**/*.js", "!**/node_modules/**"],
    coverageReporters: ["html", "json", "lcov", "text", "clover"],
}