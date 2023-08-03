import Api from "../api";

export default async function reqDeleteAccount({ id }: { id: string }) {
  return await Api.delete({ input: `/api/v1/account/${id}` });
}
