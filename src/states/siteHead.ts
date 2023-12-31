import { Accessor, Setter, createSignal } from "solid-js";
import SiteInfo from "../data/info";

export default class SiteHead {
  private static __defaultTitle = SiteInfo.title;

  private static _getTitle: Accessor<string>;
  private static _setTitle: Setter<string>;

  static init() {
    [this._getTitle, this._setTitle] = createSignal(this.__defaultTitle);
  }

  static get title(): typeof this._getTitle {
    return this._getTitle;
  }

  static set title(title: string | undefined) {
    if (title) {
      this._setTitle(`${title} - ${this.__defaultTitle}`);
    } else {
      this._setTitle(this.__defaultTitle);
    }
  }
}
