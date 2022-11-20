import { server } from "./src/mocks/server";

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => await server.resetHandlers());

// Clean up after the tests are finished.
afterAll(async () => await server.close());
