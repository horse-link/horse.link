// import { Meet } from "../pages/Dashboard/Dashboard_Logic";
import HTTPClient from "./HTTPClient";

export default class Api extends HTTPClient {
    public getMeetings = async () =>
    this.get<string[]>(
      `http://localhost:3000/meetings`
    );
}
