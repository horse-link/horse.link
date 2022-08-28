//import { Fragment, useState } from "react";
import { PageLayout } from "../../components";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Runners } from "../../types";
// import useSWR from "swr";

const runnersx = {
  "owner": "0x155c21c846b68121ca59879B3CCB5194F5Ae115E",
  "data": [
      {
          "number": 1,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 2400,
          "proposition_id": "2022-08-28-SSC-1-w1",
          "name": "KATDEEL",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf12022-08-28-SSC-1-w240000",
              "messageHash": "0x3a7c3df9aa9c47969c265ed4e21b248c62803b55d2a71888172220800c9d8be2",
              "v": "0x1b",
              "r": "0x1aff88517d9c8ea431295066f54b21c6e7d9de57973b76e1c6b1b7387f9229e1",
              "s": "0x5363a1a25275497bbaaeac609adb42339cd2a6cfe6d5ba16038bb9e322eaa6d9",
              "signature": "0x1aff88517d9c8ea431295066f54b21c6e7d9de57973b76e1c6b1b7387f9229e15363a1a25275497bbaaeac609adb42339cd2a6cfe6d5ba16038bb9e322eaa6d91b"
          }
      },
      {
          "number": 2,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 151000,
          "proposition_id": "2022-08-28-SSC-1-w2",
          "name": "THE BIG STAR",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf22022-08-28-SSC-1-w15100000",
              "messageHash": "0x7d3fafb41fc458b051db50635d4f3108b6d16304d681b69c1873061b2f5cbb67",
              "v": "0x1b",
              "r": "0x712b2a24ef9ab52af46323bbbc71d7e975e074b95eb1dd47956fd86e1c53d629",
              "s": "0x09879251f95f4213578f727e84917ad954bfaa796772305a0f7579f3e8b2e09a",
              "signature": "0x712b2a24ef9ab52af46323bbbc71d7e975e074b95eb1dd47956fd86e1c53d62909879251f95f4213578f727e84917ad954bfaa796772305a0f7579f3e8b2e09a1b"
          }
      },
      {
          "number": 3,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 12000,
          "proposition_id": "2022-08-28-SSC-1-w3",
          "name": "YANGARI",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf32022-08-28-SSC-1-w1200000",
              "messageHash": "0x7c3a9c8c4e0a68390652adcc625ecb24143c0f9941646686b04ab8f28d03e1aa",
              "v": "0x1c",
              "r": "0x9e09353854e2dddcc506cf70bc43e677fad510c7f90ddb16445d86300ea393c5",
              "s": "0x2af0abd21ef89135d335ad2591ee3abbccaaed56611efe8d9302c78c3286c0aa",
              "signature": "0x9e09353854e2dddcc506cf70bc43e677fad510c7f90ddb16445d86300ea393c52af0abd21ef89135d335ad2591ee3abbccaaed56611efe8d9302c78c3286c0aa1c"
          }
      },
      {
          "number": 4,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 21000,
          "proposition_id": "2022-08-28-SSC-1-w4",
          "name": "BOLD ENFORCER",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf42022-08-28-SSC-1-w2100000",
              "messageHash": "0x6311148784294d1f837757a91489cd06d43ca5f439222af2b7b73577fa253ee4",
              "v": "0x1c",
              "r": "0x861be48438e871752713ac9b69766a3ed1b30e74f9380c0a27270121eb5a79ab",
              "s": "0x2f97546877f94a09d9462dcc503dafd8539e4e33af67918d951690a5db040098",
              "signature": "0x861be48438e871752713ac9b69766a3ed1b30e74f9380c0a27270121eb5a79ab2f97546877f94a09d9462dcc503dafd8539e4e33af67918d951690a5db0400981c"
          }
      },
      {
          "number": 5,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 81000,
          "proposition_id": "2022-08-28-SSC-1-w5",
          "name": "LIZZIE'S PRIDE",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf52022-08-28-SSC-1-w8100000",
              "messageHash": "0xaf381f362e40e9dd0f46292208a2c629d24e23342cd29f7eb8660aab8065218c",
              "v": "0x1c",
              "r": "0xc82b422118638b56c138ce9e95007623777427e0626a824ca69433f00ecf4517",
              "s": "0x5efa13b6ddd9d5499661586a74de2a8835d5b3ac4c7f5e14779becca9767fac5",
              "signature": "0xc82b422118638b56c138ce9e95007623777427e0626a824ca69433f00ecf45175efa13b6ddd9d5499661586a74de2a8835d5b3ac4c7f5e14779becca9767fac51c"
          }
      },
      {
          "number": 6,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 16000,
          "proposition_id": "2022-08-28-SSC-1-w6",
          "name": "PETRILLO",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf62022-08-28-SSC-1-w1600000",
              "messageHash": "0xf6297895cd11d9054f61dd82699b77a5ab91e888e566fe48240ccc0318d164f9",
              "v": "0x1c",
              "r": "0x5145cbc99e39c1962d497664791461da16cda830438af4b6cac1957d32886ed7",
              "s": "0x275e21ebba7415a5bafd164206bd95962775fe4adc14e302d33c02ef10c365db",
              "signature": "0x5145cbc99e39c1962d497664791461da16cda830438af4b6cac1957d32886ed7275e21ebba7415a5bafd164206bd95962775fe4adc14e302d33c02ef10c365db1c"
          }
      },
      {
          "number": 7,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 4400,
          "proposition_id": "2022-08-28-SSC-1-w7",
          "name": "PROOST",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf72022-08-28-SSC-1-w440000",
              "messageHash": "0x59c2e998d8ac1441fe18ddc487471a89ea0e7293ccaf9616d8427bdb7a582b88",
              "v": "0x1b",
              "r": "0xa48d2a334b21d9693313393409ab84827742f34f318137172d2f3cbd6633cf88",
              "s": "0x0d2ab41a965fcaaaaf87c86ee640390a1c35a916b8df324e6166dc2c4cc2b424",
              "signature": "0xa48d2a334b21d9693313393409ab84827742f34f318137172d2f3cbd6633cf880d2ab41a965fcaaaaf87c86ee640390a1c35a916b8df324e6166dc2c4cc2b4241b"
          }
      },
      {
          "number": 8,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 151000,
          "proposition_id": "2022-08-28-SSC-1-w8",
          "name": "KURABENII",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf82022-08-28-SSC-1-w15100000",
              "messageHash": "0x40f200a192a2e69b3220abed79276521046e245facf7438fb3253f43e32fb81b",
              "v": "0x1b",
              "r": "0xa069ee208a0dfcdccc17b983d0c92be30125026397182960356090de2184dd7e",
              "s": "0x006442841695bcf609f92b99488fdd0a044f683684a613e08cd426524a462e7c",
              "signature": "0xa069ee208a0dfcdccc17b983d0c92be30125026397182960356090de2184dd7e006442841695bcf609f92b99488fdd0a044f683684a613e08cd426524a462e7c1b"
          }
      },
      {
          "number": 9,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 8000,
          "proposition_id": "2022-08-28-SSC-1-w9",
          "name": "GYPSY FOX",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf92022-08-28-SSC-1-w800000",
              "messageHash": "0xd910616637e6c030f90e0307b0ec0a3fdf803442a54ac0c7a80273b48ca19360",
              "v": "0x1c",
              "r": "0x6d5aca466a4a89278ec0bb2f9f381d4aa0123b707077868c90cc401b13d9bf0c",
              "s": "0x3245ef708d9d71d41f72a3ef5e72896e78f56b5eb8d040c9df9f7d21c62a6390",
              "signature": "0x6d5aca466a4a89278ec0bb2f9f381d4aa0123b707077868c90cc401b13d9bf0c3245ef708d9d71d41f72a3ef5e72896e78f56b5eb8d040c9df9f7d21c62a63901c"
          }
      },
      {
          "number": 10,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 11000,
          "proposition_id": "2022-08-28-SSC-1-w10",
          "name": "VON CRUMB",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf102022-08-28-SSC-1-w1100000",
              "messageHash": "0x5dd0b7dfbd3e0816b32acd7fa60b3125e416b7aebf64635a96f039c3867bf6dd",
              "v": "0x1c",
              "r": "0xec0840c509ac9d41c677805b6c69f398cef52d81f5b19c70cd494886d249076d",
              "s": "0x5b1fa392459a6538101fa6d6983056a2578beb2acba95d48a40ae8b406b8d4da",
              "signature": "0xec0840c509ac9d41c677805b6c69f398cef52d81f5b19c70cd494886d249076d5b1fa392459a6538101fa6d6983056a2578beb2acba95d48a40ae8b406b8d4da1c"
          }
      },
      {
          "number": 11,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 8500,
          "proposition_id": "2022-08-28-SSC-1-w11",
          "name": "BONLOE",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf112022-08-28-SSC-1-w850000",
              "messageHash": "0x8f249fc04d773e8868005cc6327709fb49b757707bf52a638f53b263099e9e51",
              "v": "0x1b",
              "r": "0xef13215e047d7be4fd0711974d002a7e36701d9232a6f743009bdef81c1fdad1",
              "s": "0x301cfca8909667211d4571a1c209eddd9e0e5dbbebc2e0eaa0162582d319e2df",
              "signature": "0xef13215e047d7be4fd0711974d002a7e36701d9232a6f743009bdef81c1fdad1301cfca8909667211d4571a1c209eddd9e0e5dbbebc2e0eaa0162582d319e2df1b"
          }
      },
      {
          "number": 12,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 81000,
          "proposition_id": "2022-08-28-SSC-1-w12",
          "name": "CRAIGLEA ETNA",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf122022-08-28-SSC-1-w8100000",
              "messageHash": "0xb02b86ce1f6714d1c60d202eb322f9575167fb564e6cbb6cdf2fe10924711539",
              "v": "0x1c",
              "r": "0x492c369ef1b06e57c8493dfe55f7bc1130fd704499d23a90e0e472598bb65102",
              "s": "0x6292797bf483df9b4f2408d416c1cf92fe941c8353b47e1b2a96f4e479431d06",
              "signature": "0x492c369ef1b06e57c8493dfe55f7bc1130fd704499d23a90e0e472598bb651026292797bf483df9b4f2408d416c1cf92fe941c8353b47e1b2a96f4e479431d061c"
          }
      },
      {
          "number": 13,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 18000,
          "proposition_id": "2022-08-28-SSC-1-w13",
          "name": "MOTTRAM",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf132022-08-28-SSC-1-w1800000",
              "messageHash": "0xa39b7061f28774e4a17b538647742463f95d7e894d1020a8529e5966fc8150bc",
              "v": "0x1b",
              "r": "0xb9b26b12458b1145e96add093be9b2aa15ef707fe75cb4b55e32640ec639becd",
              "s": "0x6f3d60c8c251d9c3414cb804c31ac8cd302e0e41be5f7e1a52b192f2da519852",
              "signature": "0xb9b26b12458b1145e96add093be9b2aa15ef707fe75cb4b55e32640ec639becd6f3d60c8c251d9c3414cb804c31ac8cd302e0e41be5f7e1a52b192f2da5198521b"
          }
      },
      {
          "number": 14,
          "nonce": "a3bb8f5c-f783-462e-802c-3c964ecb51bf",
          "market_id": "2022-08-28-SSC-1-w",
          "close": 0,
          "end": 0,
          "odds": 51000,
          "proposition_id": "2022-08-28-SSC-1-w14",
          "name": "STEALTH FLYER",
          "signature": {
              "message": "a3bb8f5c-f783-462e-802c-3c964ecb51bf142022-08-28-SSC-1-w5100000",
              "messageHash": "0xe2fcfe51b4cd391a1a0293b45f45cfe46e7cd5f87f1f44bb9a1c1d590ff96b4d",
              "v": "0x1b",
              "r": "0xd881eae4a63d5db9a0dd0b2ca14681c552c8f80068672c1e5fb9af813cc6fd51",
              "s": "0x10dc1a7ae978df43935497b844716437b6e95854059ba4cad4c3900f2728835e",
              "signature": "0xd881eae4a63d5db9a0dd0b2ca14681c552c8f80068672c1e5fb9af813cc6fd5110dc1a7ae978df43935497b844716437b6e95854059ba4cad4c3900f2728835e1b"
          }
      }
  ],
  "signature": "",
  "hash": ""
}

type Props = {
  runners: Runners[]
  // asLocaltime: (raceTime: number) => string;
  // meets: Meet[];
  // inPlay: string | undefined;
  // numberOfBets: number;
  // connected: boolean;
  // // hash: string;
  // signature: string;
  // owner: string;
};

const HorseRaceView: React.FC<Props> = (props: Props) => {

  const { runners } = props;
  const { track, number } = useParams();

  console.log(track);
  console.log(number);

  // TODO: Add check to see if race is complete
  // If race is complete show race results data instead

  // const { data, error } = useSWR(`/horseracing/${track}/${number}`);
  // console.log(data);

  // const runners :  = data.data;

  return (
    <PageLayout requiresAuth={false}>
      <div className="flex mb-6 p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
        <h1>
          Track: {track}
        </h1>
        <h1>
          Race #: {number}
        </h1>
        <h1>
          Date: {moment().format("DD-MM-YY")}
        </h1>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-1 py-3 text-left text-xs font-medium text-gray-500 bg-gray-200 uppercase"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Runner (Barrier)
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Weight
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Win
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Place
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {runners.map(runner => (
                    <tr key={runner.number}>
                      <td className="px-1 py-4 whitespace-nowrap bg-gray-200">{runner.number}</td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {runner.name} ({runner.number})
                        <br />
                        {/* {horse.Rider} */}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">NA</td>
                      <td className="px-2 py-4 whitespace-nowrap">{runner.odds / 1000}</td>
                      <td className="px-2 py-4 whitespace-nowrap">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HorseRaceView;
