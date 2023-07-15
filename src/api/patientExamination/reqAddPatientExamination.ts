import PatientExaminationI from "../../types/patientExamination";
import Api from "../api";

export default async function reqAddPatientExamination({
  patientId,
  examinationTime,
  examination,
  treatment,
}: {
  patientId: string;
  examinationTime: string;
  examination: string;
  treatment: string;
}) {
  const body = JSON.stringify({
    patientId,
    examinationTime,
    examination,
    treatment,
  });

  return await Api.post<PatientExaminationI>("/api/v1/patient-examination", {
    body,
    headers: {
      "content-type": "application/json",
    },
  });
}
