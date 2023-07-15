import { SignInI } from "../../types/auth";
import Api from "../api";

export default async function reqSignIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const body = JSON.stringify({ username, password });

  return await Api.post<SignInI>("/api/v1/auth/signin", {
    body,
    headers: {
      "content-type": "application/json",
    },
  });
}
