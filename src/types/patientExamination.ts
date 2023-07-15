export default interface PatientExaminationI {
  id: string;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  examinationTime: string;
  examination: string;
  treatment: string;
}

export const patientExaminationDefault = {
  id: "",
  createdAt: "",
  updatedAt: "",
  patientId: "",
  examinationTime: "",
  examination: "",
  treatment: "",
} as PatientExaminationI;
