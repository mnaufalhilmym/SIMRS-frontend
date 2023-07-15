export default interface DistrictI {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export const districtDefault = {
  id: "",
  createdAt: "",
  updatedAt: "",
  name: "",
} as DistrictI;
