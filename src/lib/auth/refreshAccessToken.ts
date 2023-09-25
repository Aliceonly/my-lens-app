import { fetcher } from "@/graphql/auth-fetcher";
import {
  RefreshMutation,
  RefreshMutationVariables,
  RefreshDocument,
} from "@/graphql/generated";
import { readAccessToken, setAccessToken } from "./helpers";

export default async function refreshAccessToken() {
  //1.读取refreshToken from storage
  const currentRefreshToken = readAccessToken()?.refreshToken;
  if (!currentRefreshToken) return null;

  //2.请求给lens api一个新的accessToken
  async function fetchData<TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: RequestInit["headers"]
  ):Promise<TData> {
    const res = await fetch("https://api.lens.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options,
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
  }

  //3.将access token存储到localStorage
  const result = await fetchData<
    RefreshMutation,
    RefreshMutationVariables
  >(RefreshDocument, {
    request: {
      refreshToken: currentRefreshToken,
    },
  });
  const {
    refresh: { accessToken, refreshToken: newRefreshToken },
  } = result;
  setAccessToken(accessToken, newRefreshToken);

  return accessToken as string;
}
