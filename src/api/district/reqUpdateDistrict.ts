import DistrictI from "../../types/district";
import Api from "../api";

export default async function reqUpdateDistrict({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const body = JSON.stringify({
    name,
  });

  return await Api.patch<DistrictI>({
    input: `/api/v1/district/${id}`,
    init: {
      body,
      headers: {
        "content-type": "application/json",
      },
    },
  });
}
