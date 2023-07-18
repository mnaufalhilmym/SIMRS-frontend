export default interface SettingI {
  id: string;
  coverImg: string;
  workers: WorkerI[];
  vision: string;
  mission: string;
}

export interface WorkerI {
  name: string;
  position: string;
}

export const settingDefault = {
  id: "",
  coverImg: "",
  workers: [],
  vision: "",
  mission: "",
} as SettingI;
