module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      "@magazyn-serwer/(.*)": "<rootDir>/src/$1"
    },
  };