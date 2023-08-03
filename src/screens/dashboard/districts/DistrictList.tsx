import {
  For,
  Show,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import DistrictI from "../../../types/district";
import SiteHead from "../../../states/siteHead";
import reqGetDistrictList from "../../../api/district/reqGetDistrictList";
import { A } from "@solidjs/router";
import SitePath from "../../../data/path";
import Loading from "../../../components/loading/Loading";
import NoData from "../../../components/nodata/NoData";
import reqCountPatient from "../../../api/patient/reqCountPatient";
import toast from "solid-toast";
import { PaginationI, paginationDefault } from "../../../types/api";

export default function DistrictListScreen() {
  let bottomItemElRef: HTMLDivElement | undefined;

  const [isLoading, setIsLoading] = createSignal(false);
  const [districts, setDistricts] = createSignal<
    (DistrictI & { patientNumber: number })[]
  >([]);

  const [lastId, setLastId] = createSignal("");
  const [pagination, setPagination] =
    createSignal<PaginationI>(paginationDefault);
  const isAllFetched = createMemo(() => {
    if (!isLoading() && districts().length >= pagination().total) {
      return true;
    }
    return false;
  });

  createRenderEffect(() => {
    SiteHead.title = "Daftar Wilayah";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await reqGetDistrictList({
        lastId: lastId(),
      });

      const data = await Promise.all(
        res.json.data.map(async (d) => {
          const patientCount = await reqCountPatient({
            searchByDistrictId: d.id,
          });
          return {
            ...d,
            patientNumber: patientCount.json.data,
          };
        })
      );

      setDistricts((prev) => [...prev, ...data]);
      setPagination(res.json.pagination);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);

      nextPageIfBottomItemElInViewport();
    }
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
    const id = districts().at(-1)?.id;
    if (!id) return;
    setLastId(id);
  }

  function nextPageIfBottomItemElInViewport() {
    const rect = bottomItemElRef?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top <= document.documentElement.clientHeight) {
      nextPage();
    }
  }

  return (
    <>
      <div class="mx-6 my-4">
        <h1 class="font-medium text-2xl">Daftar Wilayah</h1>
      </div>
      <div class="mx-6">
        <A
          href={SitePath.dashboardDistrictCreate}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Tambah data
        </A>
      </div>
      <div class="flex-1 mt-8 px-6 flex flex-col">
        <Show when={districts().length}>
          <table class="table-fixed border-collapse border border-slate-500 text-sm">
            <thead>
              <tr>
                <th class="p-2 border border-slate-600">Nama</th>
                <th class="p-2 border border-slate-600">Jumlah Pasien</th>
              </tr>
            </thead>
            <tbody>
              <For each={districts()}>
                {(p) => (
                  <tr>
                    <td class="p-2 border border-slate-700">
                      <A
                        href={SitePath.dashboardDistrictDetail.replace(
                          ":id",
                          p.id
                        )}
                        class="underline"
                      >
                        {p.name}
                      </A>
                    </td>
                    <td class="p-2 border border-slate-700">
                      {p.patientNumber}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
        <Show when={isLoading()}>
          <Loading />
        </Show>
        <Show when={!isLoading() && !districts().length}>
          <NoData />
        </Show>
        <div ref={bottomItemElRef} />
      </div>
    </>
  );
}
