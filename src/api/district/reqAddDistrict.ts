import DistrictI from "../../types/district";
import Api from "../api";

export default async function reqAddDistrict({ name }: { name: string }) {
  const body = JSON.stringify({
    name,
  });

  return await Api.post<DistrictI>("/api/v1/district", {
    body,
    headers: {
      "content-type": "application/json",
    },
  });
}
