import { SalutationE } from "../types/patient";

export default function formatSalutation(salutation: SalutationE) {
  switch (salutation) {
    case SalutationE.MR:
      return "Tn.";
    case SalutationE.MRS:
      return "Ny.";
    case SalutationE.MISS:
      return "Nn.";
    case SalutationE.CHILD:
      return "An.";
    case SalutationE.Unspecified:
      return "-";
  }
}
