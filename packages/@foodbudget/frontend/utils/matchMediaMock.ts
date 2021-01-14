export const mockBreakpoint = function mockBreakpoint(query: string): void {
  window.matchMedia = jest.fn().mockImplementation((mockQuery) => {
    return {
      matches: mockQuery === query,
      media: mockQuery,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
};
