import { MemoryRouter } from "react-router-dom";
import { render, screen, userEvent } from "src/test/utils";
import PageLayout from "./PageLayout_Logic";

const TestPageLayout = () => {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <PageLayout requiresAuth={false}>Test</PageLayout>;
    </MemoryRouter>
  );
};

it("Should contain Connect Wallet button", async () => {
  render(<TestPageLayout />);
  const connectElement = screen.getByText("Connect your Wallet");
  expect(connectElement).toBeDefined();
});

it("Should show wallet connect modal when click Connect Wallet button", async () => {
  const user = userEvent.setup();
  render(<TestPageLayout />);
  const connectElement = screen.getByText("Connect your Wallet");
  expect(connectElement).toBeDefined();

  await user.click(connectElement);

  const metamaskElement = await screen.findByText("METAMASK");
  expect(metamaskElement).toBeDefined();
  const walletConnectElement = await screen.findByText("WALLET CONNECT");
  expect(walletConnectElement).toBeDefined();
});
