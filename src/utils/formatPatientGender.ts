import { PatientGenderE } from "../types/patient";

export default function formatPatientGender(gender: PatientGenderE) {
  switch (gender) {
    case PatientGenderE.Male:
      return "Laki-laki";
    case PatientGenderE.Female:
      return "Perempuan";
    case PatientGenderE.Unspecified:
      return "-";
  }
}
