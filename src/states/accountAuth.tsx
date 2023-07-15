import { Accessor, Setter, createSignal } from "solid-js";
import { AccountAuthI, accountAuthDefault } from "../types/auth";

export default class AccountAuth {
  private static _getData: Accessor<AccountAuthI>;
  private static _setData: Setter<AccountAuthI>;

  static init() {
    [this._getData, this._setData] = createSignal(accountAuthDefault);
  }

  static get data(): typeof this._getData {
    return this._getData;
  }

  static set data(data: AccountAuthI) {
    this._setData(data);
  }
}
