import { rest } from "msw";
import { SignedMeetingsResponse } from "../../types/meets";
import { RaceStatus } from "../../constants/status";

export const restHandler = [
  rest.get("/meetings", (_, res, ctx) => {
    const meetingsDataMock: SignedMeetingsResponse = {
      owner: "0x155c21c846b68121ca59879B3CCB5194F5Ae115E",
      data: {
        nonce: "23f011f3-356f-4e44-8b7a-79618da10040",
        created: 1668658519,
        expires: 1668718519,
        meetings: [
          {
            id: "ROC",
            name: "ROCKHAMPTON",
            location: "QLD",
            date: "2022-11-17",
            races: [
              {
                number: 1,
                name: "GRANT & SIMPSON LAWYERS QTIS 2YO MAIDEN",
                start: "2022-11-17T04:18:00.000Z",
                start_unix: 1668655320,
                end: "2022-11-17T04:18:00.000Z",
                end_unix: 1668658920,
                close: "2022-11-17T04:18:00.000Z",
                close_unix: 1668658680,
                status: RaceStatus.PAYING,
                results: [1, 5, 4, 2]
              },
              {
                number: 2,
                name: "ROCKHAMPTON ENGINEERING BM65 HANDICAP",
                start: "2022-11-17T04:53:00.000Z",
                start_unix: 1668657420,
                end: "2022-11-17T04:53:00.000Z",
                end_unix: 1668661020,
                close: "2022-11-17T04:53:00.000Z",
                close_unix: 1668660780,
                status: RaceStatus.PAYING,
                results: [1, 2, 3, 4]
              },
              {
                number: 3,
                name: "TAB OPEN HANDICAP",
                start: "2022-11-17T05:30:00.000Z",
                start_unix: 1668659640,
                end: "2022-11-17T05:30:00.000Z",
                end_unix: 1668663240,
                close: "2022-11-17T05:30:00.000Z",
                close_unix: 1668663000,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 4,
                name: "GREAT NORTHERN BM60 HANDICAP",
                start: "2022-11-17T06:10:00.000Z",
                start_unix: 1668662040,
                end: "2022-11-17T06:10:00.000Z",
                end_unix: 1668665640,
                close: "2022-11-17T06:10:00.000Z",
                close_unix: 1668665400,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 5,
                name: "BUTLER PARTNERS QTIS 3YO HANDICAP",
                start: "2022-11-17T06:50:00.000Z",
                start_unix: 1668664440,
                end: "2022-11-17T06:50:00.000Z",
                end_unix: 1668668040,
                close: "2022-11-17T06:50:00.000Z",
                close_unix: 1668667800,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 6,
                name: "CHARLIE'S PEST CONTROL MAIDEN HANDICAP",
                start: "2022-11-17T07:30:00.000Z",
                start_unix: 1668666840,
                end: "2022-11-17T07:30:00.000Z",
                end_unix: 1668670440,
                close: "2022-11-17T07:30:00.000Z",
                close_unix: 1668670200,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 7,
                name: "REES R & SYDNEY JONES SOLICITORS BM70",
                start: "2022-11-17T08:05:00.000Z",
                start_unix: 1668668940,
                end: "2022-11-17T08:05:00.000Z",
                end_unix: 1668672540,
                close: "2022-11-17T08:05:00.000Z",
                close_unix: 1668672300,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 8,
                name: "CASINO NIGHT SATURDAY 10 DECEMBER 0 - 55",
                start: "2022-11-17T08:41:00.000Z",
                start_unix: 1668671100,
                end: "2022-11-17T08:41:00.000Z",
                end_unix: 1668674700,
                close: "2022-11-17T08:41:00.000Z",
                close_unix: 1668674460,
                status: RaceStatus.NORMAL,
                results: []
              }
            ]
          },
          {
            id: "MOR",
            name: "MORNINGTON",
            location: "VIC",
            date: "2022-11-17",
            races: [
              {
                number: 1,
                name: "YARGI RACING PLATE",
                start: "2022-11-17T02:56:00.000Z",
                start_unix: 1668650400,
                end: "2022-11-17T02:56:00.000Z",
                end_unix: 1668654000,
                close: "2022-11-17T02:56:00.000Z",
                close_unix: 1668653760,
                status: RaceStatus.PAYING,
                results: [6, 3, 8, 5]
              },
              {
                number: 2,
                name: "CLAYTON DOUGLAS RACING PLATE",
                start: "2022-11-17T03:31:00.000Z",
                start_unix: 1668652500,
                end: "2022-11-17T03:31:00.000Z",
                end_unix: 1668656100,
                close: "2022-11-17T03:31:00.000Z",
                close_unix: 1668655860,
                status: RaceStatus.PAYING,
                results: [1, 4, 8, 3]
              },
              {
                number: 3,
                name: "REDGUM RACING PLATE",
                start: "2022-11-17T04:06:00.000Z",
                start_unix: 1668654600,
                end: "2022-11-17T04:06:00.000Z",
                end_unix: 1668658200,
                close: "2022-11-17T04:06:00.000Z",
                close_unix: 1668657960,
                status: RaceStatus.PAYING,
                results: [9, 6, 7, 3]
              },
              {
                number: 4,
                name: "LOGAN MCGILL RACING PLATE",
                start: "2022-11-17T04:41:00.000Z",
                start_unix: 1668656700,
                end: "2022-11-17T04:41:00.000Z",
                end_unix: 1668660300,
                close: "2022-11-17T04:41:00.000Z",
                close_unix: 1668660060,
                status: RaceStatus.PAYING,
                results: [8, 12, 1, 11]
              },
              {
                number: 5,
                name: "SHANE NICHOLS RACING HANDICAP",
                start: "2022-11-17T05:16:00.000Z",
                start_unix: 1668658800,
                end: "2022-11-17T05:16:00.000Z",
                end_unix: 1668662400,
                close: "2022-11-17T05:16:00.000Z",
                close_unix: 1668662160,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 6,
                name: "JASON WARREN RACING HANDICAP",
                start: "2022-11-17T05:56:00.000Z",
                start_unix: 1668661200,
                end: "2022-11-17T05:56:00.000Z",
                end_unix: 1668664800,
                close: "2022-11-17T05:56:00.000Z",
                close_unix: 1668664560,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 7,
                name: "MATT LAURIE RACING HANDICAP",
                start: "2022-11-17T06:36:00.000Z",
                start_unix: 1668663600,
                end: "2022-11-17T06:36:00.000Z",
                end_unix: 1668667200,
                close: "2022-11-17T06:36:00.000Z",
                close_unix: 1668666960,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 8,
                name: "CLIFF BROWN RACING HANDICAP",
                start: "2022-11-17T07:16:00.000Z",
                start_unix: 1668666000,
                end: "2022-11-17T07:16:00.000Z",
                end_unix: 1668669600,
                close: "2022-11-17T07:16:00.000Z",
                close_unix: 1668669360,
                status: RaceStatus.NORMAL,
                results: []
              }
            ]
          },
          {
            id: "HAW",
            name: "HAWKESBURY",
            location: "NSW",
            date: "2022-11-17",
            races: [
              {
                number: 1,
                name: "TAB.COM.AU MAIDEN PLATE",
                start: "2022-11-17T03:21:00.000Z",
                start_unix: 1668651900,
                end: "2022-11-17T03:21:00.000Z",
                end_unix: 1668655500,
                close: "2022-11-17T03:21:00.000Z",
                close_unix: 1668655260,
                status: RaceStatus.PAYING,
                results: [1, 8, 11, 2]
              },
              {
                number: 2,
                name: "SKY RACING MAIDEN HANDICAP",
                start: "2022-11-17T03:56:00.000Z",
                start_unix: 1668654000,
                end: "2022-11-17T03:56:00.000Z",
                end_unix: 1668657600,
                close: "2022-11-17T03:56:00.000Z",
                close_unix: 1668657360,
                status: RaceStatus.PAYING,
                results: [5, 12, 4, 3]
              },
              {
                number: 3,
                name: "IRRESISTIBLE POOLS & SPAS MAIDEN PLATE",
                start: "2022-11-17T04:31:00.000Z",
                start_unix: 1668656100,
                end: "2022-11-17T04:31:00.000Z",
                end_unix: 1668659700,
                close: "2022-11-17T04:31:00.000Z",
                close_unix: 1668659460,
                status: RaceStatus.PAYING,
                results: [7, 13, 3, 14]
              },
              {
                number: 4,
                name: "PIONEER SERVICES CLASS 1 HANDICAP",
                start: "2022-11-17T05:06:00.000Z",
                start_unix: 1668658200,
                end: "2022-11-17T05:06:00.000Z",
                end_unix: 1668661800,
                close: "2022-11-17T05:06:00.000Z",
                close_unix: 1668661560,
                status: RaceStatus.INTERIM,
                results: [2, 5, 1, 7]
              },
              {
                number: 5,
                name: "XXXX GOLD F&M BM64 HANDICAP",
                start: "2022-11-17T05:46:00.000Z",
                start_unix: 1668660600,
                end: "2022-11-17T05:46:00.000Z",
                end_unix: 1668664200,
                close: "2022-11-17T05:46:00.000Z",
                close_unix: 1668663960,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 6,
                name: "BLAKES MARINE MIDWAY BM64 HANDICAP",
                start: "2022-11-17T06:26:00.000Z",
                start_unix: 1668663000,
                end: "2022-11-17T06:26:00.000Z",
                end_unix: 1668666600,
                close: "2022-11-17T06:26:00.000Z",
                close_unix: 1668666360,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 7,
                name: "LANDER TOYOTA BM68 HANDICAP",
                start: "2022-11-17T07:06:00.000Z",
                start_unix: 1668665400,
                end: "2022-11-17T07:06:00.000Z",
                end_unix: 1668669000,
                close: "2022-11-17T07:06:00.000Z",
                close_unix: 1668668760,
                status: RaceStatus.NORMAL,
                results: []
              },
              {
                number: 8,
                name: "BLACKTOWN WORKERS CLUB GROUP CG&E BM64",
                start: "2022-11-17T07:46:00.000Z",
                start_unix: 1668667800,
                end: "2022-11-17T07:46:00.000Z",
                end_unix: 1668671400,
                close: "2022-11-17T07:46:00.000Z",
                close_unix: 1668671160,
                status: RaceStatus.NORMAL,
                results: []
              }
            ]
          }
        ]
      },
      signature:
        "0xef6c9df42e2ad94d3457ebe70f19ea708cf76425991116ce630ca50fcd1683a343cb25d941550728fb98c7606344e4d2964699baa931a11e26ce3da27fc340071b"
    };
    return res(ctx.json(meetingsDataMock));
  }),

  rest.get("/inplay", (_, res, ctx) => {
    return res(
      ctx.json({
        performance: 74000000000016210000
      })
    );
  }),

  rest.get("/vaults/liquidity", (_, res, ctx) => {
    return res(
      ctx.json({
        assets: 200000237950000000131250000
      })
    );
  }),

  rest.get("/vaults/performance", (_, res, ctx) => {
    return res(
      ctx.json({
        performance: 200.00023795000000013125
      })
    );
  })
];
