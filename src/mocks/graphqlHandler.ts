import { graphql } from "msw";

export const graphqlHandler = [
  graphql.query("GetProtocols", (req, res, ctx) => {
    return res(
      ctx.data({
        protocols: [
          {
            id: "protocol",
            inPlay: "74000000000016210000",
            initialTvl: "100000000000000000000000000",
            currentTvl: "200000237950000000131250000",
            performance: "200.00023795000000013125",
            lastUpdate: "1668658836"
          }
        ]
      })
    );
  })
];
