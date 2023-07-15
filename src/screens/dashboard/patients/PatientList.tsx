import { A } from "@solidjs/router";
import SitePath from "../../../data/path";
import { For, Show, createRenderEffect, createSignal } from "solid-js";
import PatientI from "../../../types/patient";
import SiteHead from "../../../states/siteHead";
import reqGetPatientList from "../../../api/patient/reqGetPatientList";
import formatPatientGender from "../../../utils/formatPatientGender";
import { formatDate } from "../../../utils/formatDatetime";
import Loading from "../../../components/loading/Loading";
import NoData from "../../../components/nodata/NoData";
import DistrictI from "../../../types/district";
import reqGetDistrictList from "../../../api/district/reqGetDistrictList";

export default function PatientListScreen() {
  const [isLoading, setIsLoading] = createSignal(false);
  const [patients, setPatients] = createSignal<PatientI[]>([]);
  const [districts, setDistricts] = createSignal<DistrictI[]>([]);

  createRenderEffect(() => {
    SiteHead.title = "Daftar Pasien";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await Promise.all([
        reqGetPatientList(),
        reqGetDistrictList(),
      ]);

      setPatients(res[0].json.data);
      setDistricts(res[1].json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <div class="px-6 py-4">
        <h1 class="font-medium text-2xl">Daftar Pasien</h1>
      </div>
      <div class="mx-6">
        <A
          href={SitePath.dashboardPatientCreate}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Tambah data
        </A>
      </div>
      <div class="flex-1 mt-8 px-6 flex flex-col">
        <Show when={patients().length}>
          <table class="table-fixed border-collapse border border-slate-500 text-sm">
            <thead>
              <tr>
                <th class="p-2 border border-slate-600">No. RM</th>
                <th class="w-full max-w-[20%] p-2 border border-slate-600">
                  Nama Pasien
                </th>
                <th class="p-2 border border-slate-600">Jenis Kelamin</th>
                <th class="w-full max-w-[20%] p-2 border border-slate-600">
                  Tempat, Tanggal Lahir
                </th>
                <th class="p-2 border border-slate-600">Gol. Darah</th>
                <th class="w-full max-w-[20%] p-2 border border-slate-600">
                  Alamat
                </th>
                <th class="p-2 border border-slate-600">Wilayah</th>
                <th class="p-2 border border-slate-600">Telepon</th>
              </tr>
            </thead>
            <tbody>
              <For each={patients()}>
                {(p) => (
                  <tr>
                    <td class="p-2 border border-slate-700">
                      <A
                        href={SitePath.dashboardPatientDetail.replace(
                          ":id",
                          p.id
                        )}
                        class="underline"
                      >
                        {p.medicalRecordNumber}
                      </A>
                    </td>
                    <td class="p-2 border border-slate-700">
                      <A
                        href={SitePath.dashboardPatientDetail.replace(
                          ":id",
                          p.id
                        )}
                        class="underline"
                      >
                        {p.name}
                      </A>
                    </td>
                    <td class="p-2 border border-slate-700">
                      {formatPatientGender(p.gender)}
                    </td>
                    <td class="p-2 border border-slate-700">
                      {p.placeOfBirth}, {formatDate(p.dateOfBirth)}
                    </td>
                    <td class="p-2 border border-slate-700">{p.bloodGroup}</td>
                    <td class="p-2 border border-slate-700">{p.address}</td>
                    <td class="p-2 border border-slate-700">
                      {districts().find((d) => d.id === p.districtId)?.name}
                    </td>
                    <td class="p-2 border border-slate-700">{p.phone}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
        <Show when={isLoading()}>
          <div class="flex-1 flex items-center">
            <Loading />
          </div>
        </Show>
        <Show when={!isLoading() && !patients().length}>
          <div class="flex-1 flex items-center">
            <NoData />
          </div>
        </Show>
      </div>
    </>
  );
}
