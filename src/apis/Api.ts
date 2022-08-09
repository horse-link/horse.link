import { SignedResponse } from "../pages/Dashboard/Dashboard_Logic";
import HTTPClient from "./HTTPClient";

export default class Api extends HTTPClient {
  public getMeetings = async () =>
    this.get<SignedResponse>(`https://api.horse.link/meetings`);
    // this.get<SignedResponse>(`http://localhost:3000/meetings`);
}
