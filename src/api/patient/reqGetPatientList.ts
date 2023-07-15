import PatientI from "../../types/patient";
import Api from "../api";

export default async function reqGetPatientList() {
  return await Api.get<PatientI[]>("/api/v1/patients");
}
