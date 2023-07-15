import { Navigate, useParams } from "@solidjs/router";
import SitePath from "../../../data/path";

export default function PatientExaminationListScreen() {
  const params = useParams<{ id: string }>();

  return (
    <Navigate
      href={SitePath.dashboardPatientDetail.replace(":id", params.id)}
    />
  );
}
