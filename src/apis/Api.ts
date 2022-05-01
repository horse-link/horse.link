import { Meet } from "../pages/Dashboard/Dashboard_Logic";
import HTTPClient from "./HTTPClient";

export default class Api extends HTTPClient {
    public getMeetings = async () => 
    this.get<Meet[]>(
      `https://api.horse.link/meetings`
    );
}
