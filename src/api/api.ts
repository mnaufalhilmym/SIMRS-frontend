import SiteInfo from "../data/info";
import SitePath from "../data/path";
import { ResponseI } from "../types/api";

export default class Api {
  private static _baseUrl = SiteInfo.backendUrl;

  private static async fetch<T>(
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<{ status: number; json: ResponseI<T> }> {
    const token = localStorage.getItem("token");
    if (init && token) {
      init.headers = { ...init.headers, authorization: `bearer ${token}` };
    }
    const res = await fetch(`${this._baseUrl}${input}`, init);
    if (res.status === 401) {
      localStorage.removeItem("token");
      location.replace(SitePath.signin);
    }
    const json: ResponseI<T> = await res.json();
    if (json.error) throw json.error;
    return { status: res.status, json };
  }

  private static parseQuery(query?: Object) {
    let queryStr = "";
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (!v) continue;
        if (!queryStr.length) queryStr += "?";
        else queryStr += "&";
        queryStr += `${k}=${v}`;
      }
    }
    return queryStr;
  }

  static async get<T>({
    input,
    init,
    query,
  }: {
    input: RequestInfo | URL;
    init?: RequestInit | undefined;
    query?: Object;
  }): Promise<{ status: number; json: ResponseI<T> }> {
    const queryStr = this.parseQuery(query);
    return this.fetch<T>(`${input}${queryStr}`, { ...init, method: "GET" });
  }

  static async post<T>({
    input,
    init,
    query,
  }: {
    input: RequestInfo | URL;
    init?: RequestInit | undefined;
    query?: Object;
  }): Promise<{ status: number; json: ResponseI<T> }> {
    const queryStr = this.parseQuery(query);
    return this.fetch<T>(`${input}${queryStr}`, { ...init, method: "POST" });
  }

  static async put<T>({
    input,
    init,
    query,
  }: {
    input: RequestInfo | URL;
    init?: RequestInit | undefined;
    query?: Object;
  }): Promise<{ status: number; json: ResponseI<T> }> {
    const queryStr = this.parseQuery(query);
    return this.fetch<T>(`${input}${queryStr}`, { ...init, method: "PUT" });
  }

  static async patch<T>({
    input,
    init,
    query,
  }: {
    input: RequestInfo | URL;
    init?: RequestInit | undefined;
    query?: Object;
  }): Promise<{ status: number; json: ResponseI<T> }> {
    const queryStr = this.parseQuery(query);
    return this.fetch<T>(`${input}${queryStr}`, { ...init, method: "PATCH" });
  }

  static async delete<T>({
    input,
    init,
    query,
  }: {
    input: RequestInfo | URL;
    init?: RequestInit | undefined;
    query?: Object;
  }): Promise<{ status: number; json: ResponseI<T> }> {
    const queryStr = this.parseQuery(query);
    return this.fetch<T>(`${input}${queryStr}`, { ...init, method: "DELETE" });
  }
}
