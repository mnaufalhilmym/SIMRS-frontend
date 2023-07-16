import { A, useSearchParams } from "@solidjs/router";
import SitePath from "../../../data/path";
import { For, Show, createRenderEffect, createSignal } from "solid-js";
import PatientI from "../../../types/patient";
import SiteHead from "../../../states/siteHead";
import reqGetPatientList from "../../../api/patient/reqGetPatientList";
import formatPatientGender from "../../../utils/formatPatientGender";
import { formatDate } from "../../../utils/formatDatetime";
import Loading from "../../../components/loading/Loading";
import NoData from "../../../components/nodata/NoData";
import DistrictI, { districtDefault } from "../../../types/district";
import reqGetDistrictList from "../../../api/district/reqGetDistrictList";
import SearchBar from "../../../components/search/SearchBar";
import InputDropdown from "../../../components/form/InputDropdown";
import toast from "solid-toast";

export default function PatientListScreen() {
  const [isLoading, setIsLoading] = createSignal(false);
  const [patients, setPatients] = createSignal<PatientI[]>([]);
  const [districts, setDistricts] = createSignal<DistrictI[]>([]);
  const [filterByDistrict, setFilterByDistrict] = createSignal<DistrictI>();

  const [searchParams, setSearchParams] = useSearchParams<{
    search?: string;
    searchByDistrictId?: string;
  }>();

  createRenderEffect(() => {
    SiteHead.title = "Daftar Pasien";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await reqGetPatientList({
        search: searchParams.search,
        searchByDistrictId: searchParams.searchByDistrictId,
      });

      setPatients(res.json.data);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  });

  createRenderEffect(async () => {
    try {
      const res = await reqGetDistrictList();
      setDistricts(res.json.data);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    }
  });

  function setSearchValue(search?: string) {
    setPatients([]);
    setSearchParams({
      search,
      searchByDistrictId: searchParams.searchByDistrictId,
    });
  }

  function setSearchByDistrictIdValue(district: DistrictI) {
    setPatients([]);
    setSearchParams({
      search: searchParams.search,
      searchByDistrictId: district.id,
    });
    setFilterByDistrict(district);
  }

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
      <div class="mt-6 mx-6 flex gap-x-4">
        <div class="min-w-[28rem]">
          <SearchBar
            value={searchParams.search}
            placeholder="Cari nama pasien, no. RM, no. KK, atau no. KTP"
            executeSearch={setSearchValue}
            inputClass="w-full px-4 py-2 bg-black/5 border border-black/30 focus:border-light_sea_green focus:outline-none focus:ring-2 focus:ring-light_sea_green rounded-lg"
          />
        </div>
        <div class="min-w-[12rem]">
          <FilterByDistrict
            placeholder="Filter wilayah"
            value={
              filterByDistrict()
                ? {
                    title: filterByDistrict()!.name,
                    value: filterByDistrict()!.id,
                  }
                : undefined
            }
            onChangeValue={(id) =>
              setSearchByDistrictIdValue(
                districts().find((d) => d.id === id) ?? districtDefault
              )
            }
            options={[
              { title: "-", value: "" },
              ...districts().map((d) => ({ title: d.name, value: d.id })),
            ]}
          />
        </div>
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
          <Loading />
        </Show>
        <Show when={!isLoading() && !patients().length}>
          <NoData />
        </Show>
      </div>
    </>
  );
}

interface FilterByDistrictProps {
  placeholder?: string;
  value?: {
    title: string;
    value: string;
  };
  options: {
    title: string;
    value: string;
  }[];
  onChangeValue: (text: string) => void;
}

function FilterByDistrict(props: FilterByDistrictProps) {
  return (
    <InputDropdown
      name="districtId"
      placeholder={props.placeholder}
      value={props.value}
      onChangeValue={props.onChangeValue}
      options={props.options}
    />
  );
}
