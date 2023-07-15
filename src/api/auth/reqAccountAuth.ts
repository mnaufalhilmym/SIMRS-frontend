import { AccountAuthI } from "../../types/auth";
import Api from "../api";

export default async function reqAccountAuth() {
  const token = localStorage.getItem("token");
  if (!token) return;

  return await Api.get<AccountAuthI>("/api/v1/auth/account", {
    headers: {
      authorization: `bearer ${token}`,
    },
  });
}
