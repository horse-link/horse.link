import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard_Logic";
import ApolloClientProvider from "../../providers/Apollo";
import { MemoryRouter } from "react-router-dom";
import { WagmiProvider } from "../../providers/Wagmi";

const DashboardPageWithProviders = () => {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <WagmiProvider>
        <ApolloClientProvider>
          <Dashboard />
        </ApolloClientProvider>
      </WagmiProvider>
    </MemoryRouter>
  );
};

test("Dashboard page to show overall stat widgets by default", async () => {
  render(<DashboardPageWithProviders />);
  const totalLiquidityElement = screen.getByText("Total Liquidity");
  expect(totalLiquidityElement).toBeInTheDocument();
  const inPlayElement = screen.getByText("In Play");
  expect(inPlayElement).toBeInTheDocument();
  const performanceElement = screen.getByText("Performance");
  expect(performanceElement).toBeInTheDocument();
});

test("Dashboard contain switch", async () => {
  render(<DashboardPageWithProviders />);

  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeInTheDocument();
});

// test("Show wallet connect modal when toggle switch without connected wallet", async () => {
//   render(
//     <ApolloClientProvider>
//       <Dashboard />
//     </ApolloClientProvider>
//   );
//   const toggleElement = screen.getByRole("switch");
//   expect(toggleElement).toBeInTheDocument();
//   toggleElement.click();
//   const walletConnectModalElement = screen.getByText("Connect Wallet");
//   expect(walletConnectModalElement).toBeInTheDocument();
// });

// test("Show My stats widgets when toggle switch", async () => {
//   render(
//     <ApolloClientProvider>
//       <Dashboard />
//     </ApolloClientProvider>
//   );
//   const toggleElement = screen.getByRole("switch");
//   expect(toggleElement).toBeInTheDocument();
//   toggleElement.click();
//   const myDepositsElement = screen.getByText("My Deposits");
//   expect(myDepositsElement).toBeInTheDocument();
//   const myInPlayElement = screen.getByText("My In Play");
//   expect(myInPlayElement).toBeInTheDocument();
//   const myProfitsElement = screen.getByText("My Profits");
//   expect(myProfitsElement).toBeInTheDocument();
// });
