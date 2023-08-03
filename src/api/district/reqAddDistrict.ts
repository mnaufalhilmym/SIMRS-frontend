import DistrictI from "../../types/district";
import Api from "../api";

export default async function reqAddDistrict({ name }: { name: string }) {
  const body = JSON.stringify({
    name,
  });

  return await Api.post<DistrictI>({
    input: "/api/v1/district",
    init: {
      body,
      headers: {
        "content-type": "application/json",
      },
    },
  });
}
