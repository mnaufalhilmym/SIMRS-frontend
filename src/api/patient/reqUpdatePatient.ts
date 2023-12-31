import PatientI, {
  PatientGenderE,
  RelationshipInFamilyE,
  SalutationE,
} from "../../types/patient";
import Api from "../api";

export default async function reqUpdatePatient({
  id,
  medicalRecordNumber,
  familyCardNumber,
  relationshipInFamily,
  populationIdentificationNumber,
  salutation,
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
  relationshipInFamily: RelationshipInFamilyE;
  populationIdentificationNumber: string;
  salutation: SalutationE;
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
    salutation,
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

  return await Api.patch<PatientI>({
    input: `/api/v1/patient/${id}`,
    init: {
      body,
      headers: {
        "content-type": "application/json",
      },
    },
  });
}
