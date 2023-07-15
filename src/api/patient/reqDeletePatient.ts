import Api from "../api";

export default async function reqDeletePatient({ id }: { id: string }) {
  return await Api.delete(`/api/v1/patient/${id}`);
}
