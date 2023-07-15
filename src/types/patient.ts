export default interface PatientI {
  id: string;
  createdAt: string;
  updatedAt: string;
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
}

export enum RelationshipInFamilyE {
  Unspecified = "-",
  HeadOfFamily = "HEADOFFAMILY",
  Wife = "WIFE",
  Child = "CHILD",
}

export enum PatientGenderE {
  Unspecified = "-",
  Male = "MALE",
  Female = "FEMALE",
}

export const patientDefault = {
  id: "",
  createdAt: "",
  updatedAt: "",
  medicalRecordNumber: "",
  familyCardNumber: "",
  relationshipInFamily: RelationshipInFamilyE.Unspecified,
  populationIdentificationNumber: "",
  name: "",
  gender: PatientGenderE.Unspecified,
  placeOfBirth: "",
  dateOfBirth: "",
  address: "",
  districtId: "",
  job: "",
  religion: "",
  bloodGroup: "",
  insurence: "",
  insurenceNumber: "",
  phone: "",
} as PatientI;
