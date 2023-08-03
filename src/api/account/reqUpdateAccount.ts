import AccountI, { AccountRoleE } from "../../types/account";
import Api from "../api";

export default async function reqUpdateAccount({
  id,
  name,
  username,
  password,
  role,
}: {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: AccountRoleE;
}) {
  const body = JSON.stringify({
    name,
    username,
    password,
    role,
  });

  return await Api.patch<AccountI>({
    input: `/api/v1/account/${id}`,
    init: {
      body,
      headers: {
        "content-type": "application/json",
      },
    },
  });
}
