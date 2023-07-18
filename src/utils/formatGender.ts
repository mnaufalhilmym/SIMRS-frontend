import { PatientGenderE } from "../types/patient";

export default function formatGender(gender: PatientGenderE) {
  switch (gender) {
    case PatientGenderE.Male:
      return "Laki-laki";
    case PatientGenderE.Female:
      return "Perempuan";
    case PatientGenderE.Unspecified:
      return "-";
  }
}
