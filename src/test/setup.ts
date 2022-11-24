import { afterAll, afterEach, beforeAll } from "vitest";
import { fetch } from "cross-fetch";
import { server } from "src/mocks/server";

global.fetch = fetch;
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
