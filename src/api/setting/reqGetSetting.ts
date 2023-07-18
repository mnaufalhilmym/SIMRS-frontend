import SettingI from "../../types/setting";
import Api from "../api";

export default async function reqGetSetting() {
  return await Api.get<SettingI>("/api/v1/setting");
}
