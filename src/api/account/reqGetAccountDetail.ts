import AccountI from "../../types/account";
import Api from "../api";

export default async function reqGetAccountDetail({ id }: { id: string }) {
  return await Api.get<AccountI>({ input: `/api/v1/account/${id}` });
}
