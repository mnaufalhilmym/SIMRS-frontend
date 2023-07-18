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
  let queryStr = "";
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (!v) continue;
      if (!queryStr.length) queryStr += "?";
      else queryStr = "&";
      queryStr += `${k}=${v}`;
    }
  }

  return await Api.get<PatientI[]>(`/api/v1/patients${queryStr}`);
}
