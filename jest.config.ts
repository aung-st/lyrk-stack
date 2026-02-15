import type { Config } from "jest"

const config: Config = {
    preset: "ts-jest",
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.app.json",
        },
    },
    setupFiles: ["./jest.setup.ts"],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testMatch: ["**/tests/unit/*.test.(ts|tsx)"],
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy",
    },
}

export default config
