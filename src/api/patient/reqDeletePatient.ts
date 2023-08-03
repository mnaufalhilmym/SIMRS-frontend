import Api from "../api";

export default async function reqDeletePatient({ id }: { id: string }) {
  return await Api.delete({ input: `/api/v1/patient/${id}` });
}
