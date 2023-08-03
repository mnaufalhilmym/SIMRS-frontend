import PatientI from "../../types/patient";
import Api from "../api";

export default async function reqGetPatientDetail({ id }: { id: string }) {
  return await Api.get<PatientI>({ input: `/api/v1/patient/${id}` });
}
