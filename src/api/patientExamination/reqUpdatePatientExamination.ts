import PatientExaminationI from "../../types/patientExamination";
import Api from "../api";

export default async function reqUpdatePatientExamination({
  id,
  examinationTime,
  examination,
  treatment,
}: {
  id: string;
  examinationTime: string;
  examination: string;
  treatment: string;
}) {
  const body = JSON.stringify({
    examinationTime,
    examination,
    treatment,
  });

  return await Api.patch<PatientExaminationI>({
    input: `/api/v1/patient-examination/${id}`,
    init: {
      body,
      headers: {
        "content-type": "application/json",
      },
    },
  });
}
