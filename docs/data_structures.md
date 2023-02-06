# Horse Link Front End Data Structures

## Horse Racing Data

### Races

A single `Race` needs to have:

```ts
// "date" is omitted due to only allowing same-day betting
type Race = {
  id: RaceId;
  location: LocationDetails;
  runners: Runner[];
  class: RaceClass;
  condition: RaceCondition;
  status: RaceStatus;
  distance: number;
  raceNumber: number;
  start: number; // this will be a timestamp for the start time of the race
};
```

where its `id` is determined by the `LocationDetails` `code` and the `raceNumber`:

```ts
// an example getter for the race id
get id() {
  return `${this.location.code}_${this.raceNumber}`;
}
```

and the type of `RaceId` is therefore:

```ts
type RaceId = `${string}_${number}`;
```

`LocationDetails` need to have the following:

```ts
type LocationDetails = {
  code: string;
  fullName: string;
};
```

`RaceClass` will be a union of `string`s:

```ts
type RaceClass = "Class_type_one" | "Class_type_two" | "etc...";
```

as will `RaceCondition`:

```ts
type RaceCondition = "Race_condition_one" | "Race_condition_two" | "etc...";
```

as will `RaceStatus`:

```ts
// note the order of statuses as they relate to race start time
//   "Open": any time before "Closed"
//   "Closed": 4 minutes before the race start time - example getter below for implementation
//             get closeTime() {
//               return this.start - (4 * 60);
//             }
//   "Pending": any time between when the race finishes and when the results are published
//   "Resulted": any time after the results are published
type RaceStatus = "Open" | "Closed" | "Pending" | "Resulted";
```

### Results

A `Result` object will reference _one_ `Race` by its `id`:

```ts
type Result = {
  id: RaceId;
  winners: Array<RunnerId>; // an array of RunnerId's where the index corresponds to the place (0 = first...)
};
```

### Runners

A single `Runner` will need to have the following:

```ts
type Runner = {
  id: RunnerId;
  raceId: RaceId;
  rider: Rider;
  barrier: number;
  name: string;
  // the type below limits "form" to 5 elements of type "RunnerForm"
  form: [RunnerForm, RunnerForm, RunnerForm, RunnerForm, RunnerForm];
  weight: number;
  scratched: boolean; // boolean for if the runner is scratched or not
};
```

where the `RunnerId` is determined by the `RaceId` and the `Runner`'s `barrier`:

```ts
type RunnerId = `${RaceId}_${number}`;
```

with an example implementation being:

```ts
get id() {
  return `${this.raceId}_${this.barrier}`;
}
```

A `Rider` needs the following:

```ts
type Rider = {
  name: string;
  // an object for "silk" can be added when implemented, rough outline below
  //   {
  //     base: string;
  //     color: string;
  //     design: string;
  //   }
};
```

A single `RunnerForm` entry will be a union of `string`s:

```ts
type RunnerForm = "x" | "f" | "0" | "1" | "etc...";
```

## Protocol Data

### Markets

A `Market` is _different_ from a `Race` in that:

1. A `Market` refers to the _contract_ that interacts with an underlying `Vault` to provide liquidity to users
2. A `Market` programmatically or manually sets its odds
3. A `Market` is responsible for the payout of winning bets

With this model, a user can request odds when backing a proposition from the `Market` contract:

```ts
// an example request
const marketOdds = await hl.requestOdds(market, raceId);
// where "market" can be an instance of a Market contract
// and "raceId" is the id for the race

// marketOdds may look like:
type Odds = {
  id: RaceId; // corresponds to the given raceId
  odds: Record<RunnerId, number>; // an object that maps a RunnerId number to an odd
};
```

And the shape of a `Market` will need:

```ts
type Market = {
  name: string;
  address: Address;
  vaultAddress: Address;
};
```

where an `Address` is defined by:

```ts
type Address = `0x${string}`;
```

but this is usually already defined in most Web3 libraries.

### Vaults

A `Vault` interacts with a `Market` as the liquidity provider, a `Vault` must have the following:

```ts
type Vault = {
  name: string;
  address: Address;
  marketAddress: Address;
  token: Token;
};
```

where a `Token` provides the following:

```ts
type Token = {
  name: string;
  symbol: string;
  address: Address;
  decimals: number;
};
```

Note that a `Vault`'s `marketAddress` and a `Market`'s `vaultAddress` reference each other. Futhermore, a `Market` and a `Vault` will always share the same `Token`, making implementation easier - referencing something's `Market` will allow you to determine the underlying `Token`.

### Bets

A record of a `Bet` will require the following:

```ts
type Bet = {
  owner: Address;
  timestamp: number;
  marketAddress: Address;
  wager: BigNumber; // BigNumbers are recommended for blockchain amounts
  runnerId: RunnerId; // can be used to find race
  odds: number;
};
```
