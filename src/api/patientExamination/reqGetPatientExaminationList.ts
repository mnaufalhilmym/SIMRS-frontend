import PatientExaminationI from "../../types/patientExamination";
import Api from "../api";

export default async function reqGetPatientExaminationList({
  patientId,
}: {
  patientId?: string;
}) {
  let query = "";
  if (patientId) {
    if (!query.length) {
      query += "?";
    } else {
      query += "&";
    }
    query += `patientId=${patientId}`;
  }

  return await Api.get<PatientExaminationI[]>(
    `/api/v1/patient-examinations${query}`
  );
}
