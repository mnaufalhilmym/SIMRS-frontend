import PatientI, {
  PatientGenderE,
  RelationshipInFamilyE,
} from "../../types/patient";
import Api from "../api";

export default async function reqAddPatient({
  medicalRecordNumber,
  familyCardNumber,
  relationshipInFamily,
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
  medicalRecordNumber: string;
  familyCardNumber: string;
  relationshipInFamily: RelationshipInFamilyE;
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
    relationshipInFamily,
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

  return await Api.post<PatientI>("/api/v1/patient", {
    body,
    headers: {
      "content-type": "application/json",
    },
  });
}
