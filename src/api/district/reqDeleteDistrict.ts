import Api from "../api";

export default async function reqDeleteDistrict({ id }: { id: string }) {
  return await Api.delete(`/api/v1/district/${id}`);
}
