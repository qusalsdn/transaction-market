import useUser from "@libs/client/useUser";
import { NextPage } from "next";
import { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

const Auth: NextPage<Props> = ({ children }) => {
  useUser();
  return children;
};

export default Auth;
