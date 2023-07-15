import AccountI, { AccountRoleE } from "../../types/account";
import Api from "../api";

export default async function reqAddAccount({
  name,
  username,
  password,
  role,
}: {
  name: string;
  username: string;
  password: string;
  role: AccountRoleE;
}) {
  const body = JSON.stringify({
    name,
    username,
    password,
    role,
  });

  return await Api.post<AccountI>("/api/v1/account", {
    body,
    headers: {
      "content-type": "application/json",
    },
  });
}
