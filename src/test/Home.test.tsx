import React from "react";
import Home from "../pages/Home";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "./componentTestUtils";

const HomePage: React.FC = () => {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <Home />
    </MemoryRouter>
  );
};

it("Dashboard page to show overall stat widgets by default", async () => {
  render(<HomePage />);
  const totalLiquidityElement = screen.getByText("Total Liquidity");
  expect(totalLiquidityElement).toBeDefined();
  const inPlayElement = screen.getByText("In Play");
  expect(inPlayElement).toBeDefined();
  const performanceElement = screen.getByText("Performance");
  expect(performanceElement).toBeDefined();
});

it("Dashboard contain switch", async () => {
  render(<HomePage />);

  const toggleElement = screen.getByRole("switch");
  expect(toggleElement).toBeDefined();
});

// it("Show My stats widgets when toggle switch", async () => {
//   const user = userEvent.setup();
//   render(<HomePage />);
//   const toggleElement = screen.getByRole("switch");
//   expect(toggleElement).toBeDefined();

//   await user.click(toggleElement);

//   // const myDepositsElement = await screen.findByText("Deposits");
//   // expect(myDepositsElement).toBeDefined();
//   const myInPlayElement = await screen.findByText("In Play");
//   expect(myInPlayElement).toBeDefined();
//   // const myProfitsElement = await screen.findByText("Profits");
//   // expect(myProfitsElement).toBeDefined();
// });

// it("Show wallet connect modal when toggle switch without connected wallet", async () => {
//   const user = userEvent.setup();
//   render(<HomePage />);
//   const toggleElement = screen.getByRole("switch");
//   expect(toggleElement).toBeDefined();

//   await user.click(toggleElement);

//   const metamaskElement = await screen.findByText("METAMASK");
//   expect(metamaskElement).toBeDefined();
// });
