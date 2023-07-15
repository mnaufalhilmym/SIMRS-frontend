import { AccountRoleE } from "./account";

export interface SignInI {
  token: string;
  name: string;
  role: AccountRoleE;
}

export interface AccountAuthI {
  name: string;
  role: string;
}

export const accountAuthDefault = {
  name: "",
  role: AccountRoleE.Unknown,
} as AccountAuthI;

export interface RenewTokenI {
  token: string;
}
