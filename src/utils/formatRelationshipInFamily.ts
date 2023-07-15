import { RelationshipInFamilyE } from "../types/patient";

export default function formatRelationshipInFamily(
  relationship: RelationshipInFamilyE
) {
  switch (relationship) {
    case RelationshipInFamilyE.HeadOfFamily:
      return "Kepala Keluarga";
    case RelationshipInFamilyE.Wife:
      return "Istri";
    case RelationshipInFamilyE.Child:
      return "Anak";
    case RelationshipInFamilyE.Unspecified:
      return "-";
  }
}
