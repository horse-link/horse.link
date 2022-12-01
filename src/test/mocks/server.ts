import { setupServer } from "msw/node";
import { graphqlHandler } from "./graphqlHandler";
import { restHandler } from "./restHandler";

export const server = setupServer(...restHandler, ...graphqlHandler);
