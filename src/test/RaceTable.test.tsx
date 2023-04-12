import { RaceTable } from "../components/Tables";
import { Runner } from "../types/meets";
import { render, screen } from "./componentTestUtils";

type MockRunnerOption = {
  odds?: number;
};

const getMockRunner = ({ odds }: MockRunnerOption) => {
  return {
    barrier: 8,
    close: 1675657260,
    end: 1675659300,
    handicapWeight: 59.5,
    last5Starts: "007x1",
    market_id: "019394MUS03",
    name: "REMORSELESS",
    nonce: "0x45e17f022aa3f87eac63d76925e6a800",
    number: 1,
    odds,
    proposition_id: "019394MUS03W01",
    signature: {
      r: "0x6dd65085743170d1c80e27ddf1b35032bc8e871eb392faa1daf0a5e5300bfb93",
      s: "0x6318d8fe6535aba338414f21f2e2b923b3e5a098396f6b92db12b4c10ffa3d12",
      v: 28
    },
    status: "LateScratched" as const
  } as Runner;
};

type Props = {
  runners: Runner[];
};
const RaceTableComponent = ({ runners }: Props) => {
  return (
    <RaceTable
      runners={runners}
      setSelectedRunner={() => {}}
      setIsModalOpen={() => {}}
      closed={false}
    />
  );
};

it.each([
  [1, "1.00"],
  [0, "0.00"],
  [undefined, "0.00"]
])(
  "Scratched runner's odds should not show loading",
  async (odds, expected) => {
    render(<RaceTableComponent runners={[getMockRunner({ odds })]} />);
    const h = screen.getByText("REMORSELESS (8)");
    expect(h).toBeDefined();
    const cells = screen.getAllByRole("cell");
    const oddsCell = cells[4];
    expect(oddsCell.textContent).toBe(expected);
  }
);
