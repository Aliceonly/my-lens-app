import { useMutation, useQueryClient } from "@tanstack/react-query";
//0.确保用户连接钱包
//1.生成challenge with comes lens api
//2.签名challenge with user wallet
//3.发送签名后的challenge给lens api
//4.接收access token from lens api
//5.将access token存储到localStorage

import { useAddress, useSDK } from "@thirdweb-dev/react/evm";
import generateChallenge from "./generateChallenge";
import { useAuthenticateMutation } from "@/graphql/generated";
import { setAccessToken } from "./helpers";

export default function useLogin() {
  const address = useAddress();
  const sdk = useSDK();
  const { mutateAsync: sendSignedMessage } = useAuthenticateMutation();
  const client = useQueryClient();

  async function login() {
    if (!address) return;

    // 1.生成challenge with comes lens api
    const { challenge } = await generateChallenge(address);

    // 2.签名challenge with user wallet
    const signature = await sdk?.wallet.sign(challenge.text);

    //3.发送签名后的challenge给lens api
    const { authenticate } = await sendSignedMessage({
      request: {
        address: address,
        signature: signature,
      },
    });
      
    console.log("Authenticated:", authenticate);
      
    //4.接收access token from lens api
    const { accessToken, refreshToken } = authenticate;
    //5.将access token存储到localStorage
    setAccessToken(accessToken, refreshToken);

    client.invalidateQueries(["lens-user", address]);
  }
  return useMutation(login);
}
