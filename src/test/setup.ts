/// <reference types="vitest/globals" />
/// <reference types="node" />
import "@testing-library/jest-dom";

// Mock fetch for API tests
global.fetch = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
