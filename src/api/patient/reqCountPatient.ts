import Api from "../api";

export default async function reqCountPatient({
  districtId,
}: {
  districtId: string;
}) {
  return Api.get<number>(`/api/v1/patients-count?districtId=${districtId}`);
}
