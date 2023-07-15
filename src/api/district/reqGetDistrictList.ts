import DistrictI from "../../types/district";
import Api from "../api";

export default async function reqGetDistrictList() {
  return await Api.get<DistrictI[]>("/api/v1/districts");
}
