require("dotenv").config();
const axios = require("axios");
const Web3 = require("web3");
const bytes32 = require("bytes32");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Horse = require("./build/contracts/HorseLink.json");

const getCount = async () => {
  // const projectID = process.env.PROJECT_ID;
  const web3 = new Web3(process.env.NODE); // new Web3(`https://kovan.infura.io/v3/${projectID}`);
  const contract = new web3.eth.Contract(
    Horse.abi,
    process.env.CONTRACT_ADDRESS
  );

  const count = await contract.methods.count().call();
  console.log(count);
};

const addResult = result => {
  _addResult(
    result.track,
    result.year,
    result.month,
    result.day,
    result.number,
    result.first,
    result.second,
    result.third,
    result.forth
  );
};

const addResultAsync = async result => {
  console.log(
    `Adding result for Race ${result.number} at track ${result.track} ${result.day}-${result.month}-${result.year}`
  );
  const results = [
    Number(result.first),
    Number(result.second),
    Number(result.third),
    Number(result.forth)
  ];
  await _addResultAsync(
    result.track,
    Number(result.year),
    Number(result.month),
    Number(result.day),
    Number(result.number),
    results
  );
};

const _addResultAsync = async (track, year, month, day, race, results) => {
  // const projectID = process.env.PROJECT_ID;
  // const privateKey = process.env.PRIVATE_KEY;
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: process.env.MNEMONIC
    },
    providerOrUrl: process.env.NODE //`https://kovan.infura.io/v3/${projectID}`
  });

  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();

  const contract = new web3.eth.Contract(
    Horse.abi,
    process.env.CONTRACT_ADDRESS
  );
  const _nm = bytes32({ input: track });

  const exists = await contract.methods.results(_nm, year, month, day, race);
  console.log(exists);

  if (!exists) {
    try {
      const result = await contract.methods
        .addResult(_nm, year, month, day, race, results)
        .send({ from: accounts[0] }); // , gas: 50000, gasPrice: 10e9
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
};

const _addResult = (
  track,
  year,
  month,
  day,
  race,
  first,
  second,
  third,
  forth
) => {
  const projectID = process.env.PROJECT_ID;
  const privateKey = process.env.PRIVATE_KEY;
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: process.env.MNEMONIC
    },
    providerOrUrl: process.env.P_NODE
  });

  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(
    Horse.abi,
    process.env.CONTRACT_ADDRESS
  );
  const _nm = bytes32({ input: track });
  contract.methods
    .addResult(_nm, year, month, day, race, [first, second, third, forth])
    .send({ from: accounts[0] }); // , gas: 50000, gasPrice: 10e9
};

const getTodaysMeetingNames = async () => {
  const result = await axios.get(
    `https://api.beta.tab.com.au/v1/tab-info-service/racing/dates/2021-11-14/meetings?jurisdiction=QLD&&returnOffers=false&returnPromo=false`
  );

  const meetingsName = result.data.meetings.map(element => {
    return element.meetingName;
  });

  console.log(meetingsName);
  return meetingsName;
};

const getTodaysRaces = async () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();

  console.log(`${yyyy}-${mm}-${dd}`);
  return await getRaces(yyyy, mm, dd);
};

const getRaces = async (yyyy, mm, dd) => {
  const url = `https://api.beta.tab.com.au/v1/tab-info-service/racing/dates/${yyyy}-${mm}-${dd}/meetings?jurisdiction=QLD&returnOffers=false&returnPromo=false`;

  const result = await axios.get(url);

  // const result = await axios.get(
  //   `https://api.beta.tab.com.au/v1/tab-info-service/racing/dates/${yyyy}-${mm}-${dd}/meetings?jurisdiction=QLD&returnOffers=false&returnPromo=false"`
  // );

  let results = [];
  result.data.meetings.forEach(async element => {
    element.races.forEach(async race => {
      if (race.results && race.results.length > 0) {
        console.log(
          `${element.meetingDate} ${element.meetingName} ${element.venueMnemonic}`
        );
        console.log(`${race.raceNumber} ${race.raceName}`);
        console.log(race.results);

        const _result = {
          track: element.venueMnemonic,
          year: yyyy,
          month: mm,
          day: dd,
          number: race.raceNumber,
          first: race.results[0] || 0,
          second: race.results[1] || 0,
          third: race.results[2] || 0,
          forth: race.results[3] || 0
        };

        results.push(_result);
      }
    });
  });

  return results;
};

const getAndAddTodaysRaces = async () => {
  const todaysResults = await getTodaysRaces();

  for (let i = 0; i < todaysResults.length; i++) {
    //for (let i = 2; i < 5; i++) {
    await addResultAsync(todaysResults[i]);
  }

  console.log("done!");
};

const getAndAddRaces = async (yyyy, mm, dd) => {
  const results = await getRaces(yyyy, mm, dd);

  for (let i = 0; i < results.length; i++) {
    await addResultAsync(results[i]);
  }

  console.log("done!");
};

// getTodaysMeetingNames().then(async (meetings) => {
//   console.log(meetings);
// });

getCount();
getAndAddTodaysRaces();
