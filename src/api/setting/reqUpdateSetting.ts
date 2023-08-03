import { WorkerI } from "../../types/setting";
import Api from "../api";

export default async function reqUpdateSetting({
  coverImg,
  workers,
  vision,
  mission,
}: {
  coverImg: string;
  workers: WorkerI[];
  vision: string;
  mission: string;
}) {
  const body = JSON.stringify({ coverImg, workers, vision, mission });

  return Api.put({
    input: "/api/v1/setting",
    init: {
      body,
      headers: {
        "content-type": "application/json",
      },
    },
  });
}
