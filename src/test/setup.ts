import { afterAll, afterEach, beforeAll } from "vitest";
import { fetch } from "cross-fetch";
import { server } from "./mocks/server";

global.fetch = fetch;
global.IntersectionObserver = class {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
} as any;

global.ResizeObserver = class {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
};

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
