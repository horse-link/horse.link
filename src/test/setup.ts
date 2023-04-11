import { afterAll, afterEach, beforeAll } from "vitest";
import { fetch } from "cross-fetch";
import { server } from "./mocks/server";

global.fetch = fetch;
global.IntersectionObserver = class {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
} as any;

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
