import Api from "../api";

interface QueryI {
  searchByDistrictId?: string;
}

export default async function reqCountPatient(query: QueryI) {
  let queryStr = "";
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (!queryStr.length) {
        queryStr += "?";
      } else {
        queryStr += "&";
      }
      queryStr += `${k}=${v}`;
    }
  }

  return Api.get<number>(`/api/v1/patients-count${queryStr}`);
}
