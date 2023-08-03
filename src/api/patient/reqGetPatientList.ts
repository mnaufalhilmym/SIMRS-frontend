import PatientI from "../../types/patient";
import Api from "../api";

interface QueryI {
  searchByMedicalRecordNumber?: string;
  searchByFamilyCardNumber?: string;
  searchByDistrictId?: string;
  search?: string;
  limit?: number;
  lastId?: string;
}

export default async function reqGetPatientList(query?: QueryI) {
  return await Api.get<PatientI[]>({ input: "/api/v1/patients", query });
}
