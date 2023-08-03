import AccountI from "../../types/account";
import Api from "../api";

interface QueryI {
  limit?: number;
  lastId?: string;
}

export default async function reqGetAccountList(query?: QueryI) {
  return await Api.get<AccountI[]>({ input: "/api/v1/accounts", query });
}
