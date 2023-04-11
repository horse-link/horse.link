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
