import Api from "../api";

interface QueryI {
  searchByDistrictId?: string;
}

export default async function reqCountPatient(query: QueryI) {
  return Api.get<number>({ input: "/api/v1/patients-count", query });
}
