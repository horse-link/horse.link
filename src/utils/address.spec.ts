import { shortenAddress } from "./shortenAddress";
import { shortenHash } from "./shortenHash";

describe("address tests", () => {
  it("should shorten address", () => {
    const actual = shortenAddress("0x00000000219ab540356cBB839Cbe05303d7705Fa");
    expect(actual).toEqual("0x000...705Fa");
  });

  it("should shorten hash", () => {
    const actual = shortenHash(
      "0x28d9cb5e5a5c4c5d27cf9d8b91ca9b34c31452d105a7201ecd327876f816a592"
    );
    expect(actual).toEqual("0x28d9cb5e5a5c4...d327876f816a592");
  });
});
