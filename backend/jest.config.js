module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  // Run tests serially to avoid database conflicts
  maxWorkers: 1,
  // Clear mocks between tests
  clearMocks: true,
  // Reset modules between tests
  resetMocks: true,
  // Restore mocks between tests
  restoreMocks: true
};

