import MyBetsView from "./MyBets_View";
import { gql, useQuery } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

const APIURL = "https://api.thegraph.com/subgraphs/name/pondpiu/market";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache()
});

const MY_BETS = gql`
  query {
    placedEntities {
      amount
      id
      owner
      payout
      propositionId
    }
  }
`;

const useMyBets = () => {
  const { loading, error, data } = useQuery(MY_BETS);

  return data?.placedEntities ?? [];
};

const MyBetsLogics = () => {
  const myBetsData = useMyBets();
  const onClickBet = (betData: any) => {
    console.log("Clicked bet", betData);
  };
  return <MyBetsView myBetsData={myBetsData} onClickBet={onClickBet} />;
};

const MyBets = () => {
  return (
    <ApolloProvider client={client}>
      <MyBetsLogics />
    </ApolloProvider>
  );
};

export default MyBets;
