import { A, useSearchParams } from "@solidjs/router";
import SitePath from "../../../data/path";
import {
  For,
  Show,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import PatientI from "../../../types/patient";
import SiteHead from "../../../states/siteHead";
import reqGetPatientList from "../../../api/patient/reqGetPatientList";
import formatGender from "../../../utils/formatGender";
import { formatDate } from "../../../utils/formatDatetime";
import Loading from "../../../components/loading/Loading";
import NoData from "../../../components/nodata/NoData";
import DistrictI, { districtDefault } from "../../../types/district";
import reqGetDistrictList from "../../../api/district/reqGetDistrictList";
import SearchBar from "../../../components/search/SearchBar";
import InputDropdown from "../../../components/form/InputDropdown";
import toast from "solid-toast";
import formatSalutation from "../../../utils/formatSalutation";
import { PaginationI, paginationDefault } from "../../../types/api";

interface FetchQueryI {
  search?: string;
  searchByDistrictId?: string;
  lastId?: string;
}

export default function PatientListScreen() {
  let bottomItemElRef: HTMLDivElement | undefined;

  const [searchParams, setSearchParams] = useSearchParams<{
    search?: string;
    searchByDistrictId?: string;
  }>();

  const [isLoading, setIsLoading] = createSignal(false);
  const [patients, setPatients] = createSignal<PatientI[]>([]);
  const [districts, setDistricts] = createSignal<DistrictI[]>([]);

  const [fetchQuery, setFetchQuery] = createSignal<FetchQueryI>();
  const [pagination, setPagination] =
    createSignal<PaginationI>(paginationDefault);
  const isAllFetched = createMemo(() => {
    if (!isLoading() && patients().length >= pagination().total) {
      return true;
    }
    return false;
  });

  createRenderEffect(() => {
    SiteHead.title = "Daftar Pasien";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await reqGetPatientList(fetchQuery());

      setPatients((data) => [...data, ...res.json.data]);
      setPagination(res.json.pagination);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);

      nextPageIfBottomItemElInViewport();
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

  createRenderEffect(() => {
    setFetchQuery({
      search: searchParams.search,
      searchByDistrictId: searchParams.searchByDistrictId,
      lastId: undefined,
    });
  });

  onMount(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (isAllFetched()) {
          if (bottomItemElRef) observer.unobserve(bottomItemElRef);
          return;
        }
        nextPage();
      }
    });

    if (bottomItemElRef) observer.observe(bottomItemElRef);

    onCleanup(() => {
      if (bottomItemElRef) observer.unobserve(bottomItemElRef);
    });
  });

  function nextPage() {
    if (isLoading() || isAllFetched()) return;
    const id = patients().at(-1)?.id;
    if (!id) return;
    setFetchQuery({
      search: searchParams.search,
      searchByDistrictId: searchParams.searchByDistrictId,
      lastId: id,
    });
  }

  function nextPageIfBottomItemElInViewport() {
    const rect = bottomItemElRef?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top <= document.documentElement.clientHeight) {
      nextPage();
    }
  }

  function setSearchValue(search?: string) {
    setPatients([]);

    setSearchParams({
      search,
      searchByDistrictId: searchParams.searchByDistrictId,
    });
  }

  function setSearchByDistrictIdValue(districtId: string) {
    if (fetchQuery()?.searchByDistrictId === districtId) return;

    setPatients([]);

    setSearchParams({
      search: searchParams.search,
      searchByDistrictId: districtId,
    });
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
              fetchQuery()?.searchByDistrictId
                ? {
                    title: districts().find(
                      (d) => d.id === fetchQuery()?.searchByDistrictId
                    )?.name!,
                    value: fetchQuery()?.searchByDistrictId!,
                  }
                : undefined
            }
            onChangeValue={(id) => setSearchByDistrictIdValue(id)}
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
                        {p.salutation
                          ? `${formatSalutation(p.salutation)} ${p.name}`
                          : p.name}
                      </A>
                    </td>
                    <td class="p-2 border border-slate-700">
                      {formatGender(p.gender)}
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
        <div ref={bottomItemElRef} />
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
