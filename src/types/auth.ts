import { AccountRoleE } from "./account";

export interface SignInI {
  token: string;
  name: string;
  role: AccountRoleE;
}

export interface AccountAuthI {
  token: string;
  name: string;
  role: string;
}

export const accountAuthDefault = {
  token: "",
  name: "",
  role: AccountRoleE.Unknown,
} as AccountAuthI;
