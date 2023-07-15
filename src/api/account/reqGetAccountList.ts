import AccountI from "../../types/account";
import Api from "../api";

export default async function reqGetAccountList() {
  return await Api.get<AccountI[]>("/api/v1/accounts");
}
