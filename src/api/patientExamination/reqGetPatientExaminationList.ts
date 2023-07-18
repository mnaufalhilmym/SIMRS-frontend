import PatientExaminationI from "../../types/patientExamination";
import Api from "../api";

interface QueryI {
  patientId?: string;
}

export default async function reqGetPatientExaminationList(query?: QueryI) {
  let queryStr = "";
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (!queryStr.length) {
        queryStr += "?";
      } else {
        queryStr += "&";
      }
      queryStr += `${k}=${v}`;
    }
  }

  return await Api.get<PatientExaminationI[]>(
    `/api/v1/patient-examinations${queryStr}`
  );
}
