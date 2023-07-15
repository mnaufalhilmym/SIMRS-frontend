export default interface AccountI {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: AccountRoleE;
  lastActivityTime?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AccountRoleE {
  Unknown = "",
  SuperAdmin = "SUPERADMIN",
  Admin = "ADMIN",
}

export const accountDefault = {
  id: "",
  name: "",
  username: "",
  role: AccountRoleE.Unknown,
  lastActivityTime: "",
  createdAt: "",
  updatedAt: "",
} as AccountI;
