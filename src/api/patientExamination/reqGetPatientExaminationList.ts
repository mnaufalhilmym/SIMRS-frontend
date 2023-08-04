import PatientExaminationI from "../../types/patientExamination";
import Api from "../api";

interface QueryI {
  patientId?: string;
  limit?: number;
  lastId?: string;
}

export default async function reqGetPatientExaminationList(query?: QueryI) {
  return await Api.get<PatientExaminationI[]>({
    input: "/api/v1/patient-examinations",
    query,
  });
}
