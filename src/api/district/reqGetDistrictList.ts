import DistrictI from "../../types/district";
import Api from "../api";

interface QueryI {
  limit?: number;
  lastId?: string;
}

export default async function reqGetDistrictList(query?: QueryI) {
  return await Api.get<DistrictI[]>({ input: "/api/v1/districts", query });
}
