import PatientI, { PatientGenderE } from "../../types/patient";
import Api from "../api";

export default async function reqUpdatePatient({
  id,
  medicalRecordNumber,
  familyCardNumber,
  populationIdentificationNumber,
  name,
  gender,
  placeOfBirth,
  dateOfBirth,
  address,
  districtId,
  job,
  religion,
  bloodGroup,
  insurence,
  insurenceNumber,
  phone,
}: {
  id: string;
  medicalRecordNumber: string;
  familyCardNumber: string;
  populationIdentificationNumber: string;
  name: string;
  gender: PatientGenderE;
  placeOfBirth: string;
  dateOfBirth: string;
  address: string;
  districtId: string;
  job: string;
  religion: string;
  bloodGroup: string;
  insurence: string;
  insurenceNumber: string;
  phone: string;
}) {
  const body = JSON.stringify({
    medicalRecordNumber,
    familyCardNumber,
    populationIdentificationNumber,
    name,
    gender,
    placeOfBirth,
    dateOfBirth,
    address,
    districtId,
    job,
    religion,
    bloodGroup,
    insurence,
    insurenceNumber,
    phone,
  });

  return await Api.patch<PatientI>(`/api/v1/patient/${id}`, {
    body,
    headers: {
      "content-type": "application/json",
    },
  });
}
