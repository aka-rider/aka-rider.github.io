import '@testing-library/jest-dom';

process.env.__NEXT_TRAILING_SLASH = 'true';

// Allow router mocks.
// eslint-disable-next-line no-undef
jest.mock('next/router', () => require('next-router-mock'));
