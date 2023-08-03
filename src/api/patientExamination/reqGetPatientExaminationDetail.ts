import PatientExaminationI from "../../types/patientExamination";
import Api from "../api";

export default async function reqGetPatientExaminationDetail({
  id,
}: {
  id: string;
}) {
  return await Api.get<PatientExaminationI>({
    input: `/api/v1/patient-examination/${id}`,
  });
}
