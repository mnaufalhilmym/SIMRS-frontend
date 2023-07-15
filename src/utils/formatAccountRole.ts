import { AccountRoleE } from "../types/account";

export default function formatAccountRole(role: AccountRoleE) {
  switch (role) {
    case AccountRoleE.SuperAdmin:
      return "Super Admin";
    case AccountRoleE.Admin:
      return "Admin";
    case AccountRoleE.Unknown:
      return "";
  }
}
