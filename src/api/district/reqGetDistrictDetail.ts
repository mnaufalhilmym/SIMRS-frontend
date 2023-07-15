import DistrictI from "../../types/district";
import Api from "../api";

export default async function reqGetDistrictDetail({ id }: { id: string }) {
  return await Api.get<DistrictI>(`/api/v1/district/${id}`);
}
