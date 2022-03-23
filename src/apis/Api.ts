import HTTPClient from "./HTTPClient";
export default class Api extends HTTPClient {
  public login = async (body: any) =>
    this.post<string>(`/auth/login`, body);

  public signup = async (body: any) =>
    this.post<string>(`/auth/signup`, body);

  public fetchAuthUser = async () => this.get<any>(`/user`);
}
