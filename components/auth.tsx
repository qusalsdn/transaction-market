import useUser from "@libs/client/useUser";
import { NextPage } from "next";
import { ReactElement } from "react";

interface props {
  children: ReactElement;
}

const Auth: NextPage<props> = ({ children }) => {
  useUser();
  return children;
};

export default Auth;
