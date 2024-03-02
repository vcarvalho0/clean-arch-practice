import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class Request {
  constructor(private request = axios) {}

  public get<T>(
    url: string,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request.get<T, AxiosResponse<T>>(url, config);
  }

  public static getRequestError(error: unknown) {
    const axiosError = error as AxiosError;

    if (axiosError.response && axiosError.response.status) {
      return {
        data: axiosError.response.data,
        statusCode: axiosError.response.status
      };
    }

    throw new Error(`${error} is not a request error`);
  }
}
