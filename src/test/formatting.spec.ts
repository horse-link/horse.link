import dayjs from "dayjs";
import utils from "../utils";

describe("address tests", () => {
  it("should shorten hash", () => {
    const actual = utils.formatting.shortenHash(
      "0x28d9cb5e5a5c4c5d27cf9d8b91ca9b34c31452d105a7201ecd327876f816a592"
    );
    expect(actual).toEqual("0x28d9cb5e5a5c4...d327876f816a592");
  });
});

describe("general formatting tests", () => {
  it("should capitalise the first letter", () => {
    const wordOne = "foo";
    const wordTwo = "Bar";
    const wordThree = "FOO";
    const wordFour = "bAR";

    expect(utils.formatting.formatFirstLetterCapitalised(wordOne)).toEqual(
      "Foo"
    );
    expect(utils.formatting.formatFirstLetterCapitalised(wordTwo)).toEqual(
      "Bar"
    );
    expect(utils.formatting.formatFirstLetterCapitalised(wordThree)).toEqual(
      "Foo"
    );
    expect(utils.formatting.formatFirstLetterCapitalised(wordFour)).toEqual(
      "Bar"
    );
  });

  it("should get the time difference formatted (minutes and seconds)", () => {
    const dateOne = dayjs().add(1, "minute");
    const dateOneFormatted = utils.formatting.formatTimeToHMS(
      dateOne.toString()
    );
    // account for second elapsing
    expect(dateOneFormatted).toEqual("0h 0m 59s");

    const dateTwo = dayjs().subtract(1, "minute");
    const dateTwoFormatted = utils.formatting.formatTimeToHMS(
      dateTwo.toString()
    );
    expect(dateTwoFormatted).toEqual("-0h 1m 0s");

    const dateThree = dayjs().add(30, "seconds");
    const dateThreeFormatted = utils.formatting.formatTimeToHMS(
      dateThree.toString()
    );
    // account for second elapsing
    expect(dateThreeFormatted).toEqual("0h 0m 29s");

    const dateFour = dayjs().subtract(30, "seconds");
    const dateFourFormatted = utils.formatting.formatTimeToHMS(
      dateFour.toString()
    );
    expect(dateFourFormatted).toEqual("-0h 0m 30s");

    const dateFive = dayjs().add(1, "minute").add(30, "seconds");
    const dateFiveFormatted = utils.formatting.formatTimeToHMS(
      dateFive.toString()
    );
    // account for second elapsing
    expect(dateFiveFormatted).toEqual("0h 1m 29s");

    const dateSix = dayjs().subtract(1, "minute").subtract(30, "seconds");
    const dateSixFormatted = utils.formatting.formatTimeToHMS(
      dateSix.toString()
    );
    expect(dateSixFormatted).toEqual("-0h 1m 30s");
  });

  it("should get the time difference formatted (hours)", () => {
    const dateOne = dayjs().add(1, "hour").add(1, "second");
    const dateOneFormatted = utils.formatting.formatTimeToHMS(
      dateOne.toString()
    );
    // account for second elapsing
    expect(dateOneFormatted).toEqual("1h 0m 0s");

    const dateTwo = dayjs().subtract(1, "hour");
    const dateTwoFormatted = utils.formatting.formatTimeToHMS(
      dateTwo.toString()
    );
    expect(dateTwoFormatted).toEqual("-1h 0m 0s");

    const dateThree = dayjs()
      .add(1, "hour")
      .add(30, "minutes")
      .add(1, "second");
    const dateThreeFormatted = utils.formatting.formatTimeToHMS(
      dateThree.toString()
    );
    // account for second elapsing
    expect(dateThreeFormatted).toEqual("1h 30m 0s");

    const dateFour = dayjs().subtract(1, "hour").subtract(30, "minutes");
    const dateFourFormatted = utils.formatting.formatTimeToHMS(
      dateFour.toString()
    );
    expect(dateFourFormatted).toEqual("-1h 30m 0s");
  });
});
