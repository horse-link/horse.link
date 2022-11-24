import { expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "../../utils/test-utils";
import Dashboard from "./Dashboard_Logic";
import ApolloProvider from "../../providers/Apollo";
import { MemoryRouter } from "react-router-dom";
import { WalletModalContext } from "../../providers/WalletModal";
import { WagmiProvider } from "../../../src/providers/Wagmi";

const DashboardPageWithProviders = ({ openWalletFn = vi.fn() }: any) => {
  return (
    <WagmiProvider>
      <WalletModalContext.Provider
        value={{
          openWalletModal: openWalletFn,
          closeWalletModal: vi.fn(),
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

it("Dashboard page to show overall stat widgets by default", async () => {
  render(<DashboardPageWithProviders />);
  const totalLiquidityElement = screen.getByText("Total Liquidity");
  expect(totalLiquidityElement).toBeDefined();
  const inPlayElement = screen.getByText("In Play");
  expect(inPlayElement).toBeDefined();
  const performanceElement = screen.getByText("Performance");
  expect(performanceElement).toBeDefined();
});

it("Dashboard contain switch", async () => {
  render(<DashboardPageWithProviders />);

  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeDefined();
});

it("Show My stats widgets when toggle switch", async () => {
  render(<DashboardPageWithProviders />);
  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeDefined();
  act(() => {
    toggleElement.click();
  });
  const myDepositsElement = await screen.findByText("Deposits");
  expect(myDepositsElement).toBeDefined();
  const myInPlayElement = await screen.findByText("In Play");
  expect(myInPlayElement).toBeDefined();
  const myProfitsElement = await screen.findByText("Profits");
  expect(myProfitsElement).toBeDefined();
});

it("Show wallet connect modal when toggle switch without connected wallet", async () => {
  const mockOpenWalletFn = vi.fn();
  render(<DashboardPageWithProviders openWalletFn={mockOpenWalletFn} />);
  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeDefined();
  act(() => {
    toggleElement.click();
  });
  await waitFor(() => {
    expect(mockOpenWalletFn).toHaveBeenCalled();
  });
});
