const STORAGE_KEY = "LH_STORAGE_KEY";

export function isTokenExpired(exp: number) {
  if (!exp) return true;

  if (Date.now() >= exp * 1000) {
    return false;
  }
  return true;
}

//1.读取accessToken from storage
export function readAccessToken() {
  if (typeof window === "undefined") return null;
  const ls = window.localStorage || localStorage;
  if (!ls) throw new Error("localstorage not supported");
  const data = ls.getItem(STORAGE_KEY);
  if (!data) return null;
  return JSON.parse(data) as {
    accessToken: string;
    refreshToken: string;
    exp: number;
  };
}

//2.设置accessTokne in storage
export function setAccessToken(accessToken: string, refreshToken: string) {
  //1.parse JWT token and 提取过期日期字段
  const { exp } = parseJwt(accessToken);
  //2.设置localstorage
  const ls = window.localStorage || localStorage;
  if (!ls) throw new Error("localstorage not supported");
  ls.setItem(STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, exp }));
}
//3.parse JWT token and 提取exp日期字段
function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
