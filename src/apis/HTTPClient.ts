import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance
} from "axios";

export default class HTTPClient {
  private client: AxiosInstance;
  private customOnError: Function | undefined;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }

  protected get = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    (this.client
      .get(url, axiosReqConfig)
      .then(this.onSuccess)
      .catch(this.onError) as unknown) as Promise<T>;
  protected post = <T>(
    url: string,
    data?: unknown,
    reqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    (this.client
      .post(url, data, reqConfig)
      .then(this.onSuccess)
      .catch(this.onError) as unknown) as Promise<T>;
  protected put = <T>(
    url: string,
    data?: unknown,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    (this.client
      .put(url, data, axiosReqConfig)
      .then(this.onSuccess)
      .catch(this.onError) as unknown) as Promise<T>;
  public setCustomOnError = (onError: Function) => {
    this.customOnError = onError;
  };

  private onSuccess = (res: AxiosResponse) => res.data;
  private onError = (e: AxiosError) => {
    const error = e.response ? e.response.data : e;

    if (this.customOnError) {
      this.customOnError(error);
    }

    throw error;
  };
}
