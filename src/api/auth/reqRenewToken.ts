import { RenewTokenI } from "../../types/auth";
import Api from "../api";

export default async function reqRenewToken() {
  return await Api.post<RenewTokenI>("/api/v1/auth/renew-token");
}
