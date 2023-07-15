import Api from "../api";

export default async function reqDeleteAccount({ id }: { id: string }) {
  return await Api.delete(`/api/v1/account/${id}`);
}
