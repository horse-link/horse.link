import axios from "axios";
import { SignedMeetingsResponse, SignedRunnersResponse } from "../types/index";

export default class Api {

  public getMeetings = async (): Promise<SignedMeetingsResponse> => {
    const { data, status } = await axios.get<SignedMeetingsResponse>(
      "http://localhost:3002/meetings",
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    return data;
  };

  // this.get<SignedResponse>(`https://api.horse.link/meetings`);

  public getRunners = async (track: string, number: number): Promise<SignedRunnersResponse> => {
    const { data, status } = await axios.get<SignedRunnersResponse>(
      `http://localhost:3002/runners/${track}/${number}/win`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    return data;
  };
}
