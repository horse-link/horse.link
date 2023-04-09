import * as blockchain from "./blockchain";
import * as contracts from "./contracts";
import * as time from "./time";
import * as env from "./env";
import * as locations from "./locations";
import * as racestatus from "./status";
import * as subgraph from "./subgraph";
import * as wagmi from "./wagmi";

const constants = {
  blockchain,
  time,
  env,
  locations,
  contracts,
  racestatus,
  subgraph,
  wagmi
};

export default constants;
