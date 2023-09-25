import {
  useAddress,
  useNetworkMismatch,
  useNetwork,
  ChainId,
  ConnectWallet,
} from "@thirdweb-dev/react";
import React from "react";
import useLensUser from "../lib/auth/useLensUser";
import useLogin from "../lib/auth/useLogin";

type Props = {};

const SignInButton = ({}: Props) => {
  const address = useAddress(); //检测连接地址
  const isOnWrongNetwork = useNetworkMismatch(); //检测用户所在错误网络
  const [, switchNetwork] = useNetwork(); //切换网络
  const { isSignedInQuery, profileQuery } = useLensUser();
  const { mutate: requestLogin } = useLogin();
  //用户连接钱包
  if (!address) {
    return <ConnectWallet />;
  }
  //用户切换网络
  if (isOnWrongNetwork) {
    return (
      <button onClick={() => switchNetwork?.(ChainId.Polygon)}>
        Switch Network
      </button>
    );
  }
  //登录lens

  //加载登陆状态
  if (isSignedInQuery.isLoading) {
    return <div>loading...</div>;
  }

  //未登录
  if (!isSignedInQuery.data) {
    return <button onClick={() => requestLogin()}>Sign in with Lens</button>;
  }

  //展示profile
  if (profileQuery.isLoading) {
    return <div>loading...</div>;
  }

  if (profileQuery.data?.defaultProfile) {
    return <div>No Lens Profile</div>;
  }

  if (profileQuery.data?.defaultProfile) {
    return <div>Hello {profileQuery.data?.defaultProfile?.handle}!</div>;
  }

  return <div>Something went wrong</div>;
};

export default SignInButton;
