import { isTokenExpired, readAccessToken } from "@/lib/auth/helpers";
import refreshAccessToken from "@/lib/auth/refreshAccessToken";

export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"]
): (() => Promise<TData>) => {
  async function getAccessToken() {
    //1.读取accessToken from storage
    const token = readAccessToken();
    //如果不是一个token，return null
    if (!token) return null;
    let accessToken = token.accessToken;
    //如果是一个token，检查是否过期
    if (isTokenExpired(token.exp)) {
      //如果token过期，刷新token
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      accessToken = newToken;
    }

    //return token
    return accessToken;
  }

  return async () => {
    const token = typeof window !== "undefined" ? await getAccessToken() : null;

    const res = await fetch("https://api.lens.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options,
        // TODO: add auth header
        "x-access-token": token ? token : "",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || {};
      throw new Error(message || "Error…");
    }

    return json.data;
  };
};
