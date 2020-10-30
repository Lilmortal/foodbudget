module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    // '*.(ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  modulePathIgnorePatterns: ['dist'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|svg)$': './config/__mocks__/fileMock',
  },
  setupFilesAfterEnv: ['./config/jest/setupTests.js'],
};
