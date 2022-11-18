import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard_Logic";
import ApolloProvider from "../../providers/Apollo";
import { MemoryRouter } from "react-router-dom";
import { WagmiProvider } from "../../providers/Wagmi";
import { WalletModalContext } from "../../providers/WalletModal";
import { useContext } from "react";

const DashboardPageWithProviders = ({ openWalletFn = jest.fn }) => {
  return (
    <WagmiProvider>
      <WalletModalContext.Provider
        value={{
          openWalletModal: openWalletFn,
          closeWalletModal: jest.fn(),
          isWalletModalOpen: false
        }}
      >
        <ApolloProvider>
          <MemoryRouter initialEntries={[{ pathname: "/" }]}>
            <Dashboard />
          </MemoryRouter>
        </ApolloProvider>
      </WalletModalContext.Provider>
    </WagmiProvider>
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

test("Show wallet connect modal when toggle switch without connected wallet", async () => {
  const mockOpenWalletFn = jest.fn();
  render(<DashboardPageWithProviders openWalletFn={mockOpenWalletFn} />);
  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeInTheDocument();
  toggleElement.click();
  await waitFor(() => {
    expect(mockOpenWalletFn).toHaveBeenCalled();
  });
});

test("Show My stats widgets when toggle switch", async () => {
  render(<DashboardPageWithProviders />);
  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeInTheDocument();
  toggleElement.click();
  const myDepositsElement = await screen.findByText("My Deposits");
  expect(myDepositsElement).toBeInTheDocument();
  const myInPlayElement = await screen.findByText("My In Play");
  expect(myInPlayElement).toBeInTheDocument();
  const myProfitsElement = await screen.findByText("My Profits");
  expect(myProfitsElement).toBeInTheDocument();
});
