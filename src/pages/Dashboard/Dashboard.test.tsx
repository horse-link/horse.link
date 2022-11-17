import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard_Logic";
import ApolloClientProvider from "../../providers/Apollo";

test("Dashboard page to show overall stat widgets by default", async () => {
  render(
    <ApolloClientProvider>
      <Dashboard />
    </ApolloClientProvider>
  );
  const totalLiquidityElement = screen.getByText("Total Liquidity");
  expect(totalLiquidityElement).toBeInTheDocument();
  const inPlayElement = screen.getByText("In Play");
  expect(inPlayElement).toBeInTheDocument();
  const performanceElement = screen.getByText("Performance");
  expect(performanceElement).toBeInTheDocument();
});

test("Dashboard contain switch", async () => {
  render(
    <ApolloClientProvider>
      <Dashboard />
    </ApolloClientProvider>
  );
  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeInTheDocument();
});
