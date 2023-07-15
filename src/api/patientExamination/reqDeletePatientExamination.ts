import Api from "../api";

export default async function reqDeletePatientExamination({
  id,
}: {
  id: string;
}) {
  return await Api.delete(`/api/v1/patient-examination/${id}`);
}
