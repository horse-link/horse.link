import { MemoryRouter } from "react-router-dom";
import { render, screen, userEvent } from "./componentTestUtils";
import { PageLayout } from "../components";

const TestPageLayout = () => {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <PageLayout>Test</PageLayout>;
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
  const walletConnectElement = await screen.findByText("WALLETCONNECT");
  expect(walletConnectElement).toBeDefined();
});
