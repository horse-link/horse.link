import { MemoryRouter } from "react-router-dom";
import { render, screen } from "./componentTestUtils";
import { PageLayout } from "../components";

const TestPageLayout = () => {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <PageLayout>Test</PageLayout>;
    </MemoryRouter>
  );
};

it("Should contain Account title", async () => {
  render(<TestPageLayout />);
  const accountElement = screen.getByText("Account");
  expect(accountElement).toBeDefined();
});

// it("Should show wallet connect modal when click Connect Wallet button", async () => {
//   const user = userEvent.setup();
//   render(<TestPageLayout />);
//   const connectElement = screen.getByText("Connect your Wallet");
//   expect(connectElement).toBeDefined();

//   await user.click(connectElement);

//   const metamaskElement = await screen.findByText("METAMASK");
//   expect(metamaskElement).toBeDefined();
//   // const walletConnectElement = await screen.findByText("WALLETCONNECT");
//   // expect(walletConnectElement).toBeDefined();
// });

it("Should contain Account Panel", async () => {
  render(<TestPageLayout />);
  const accountPanelElement = screen.getByText("Account");
  expect(accountPanelElement).toBeDefined();
});

it("Should contain Bet Slip", async () => {
  render(<TestPageLayout />);
  const betSlipElement = screen.getByText("Bet Slip");
  expect(betSlipElement).toBeDefined();
});
