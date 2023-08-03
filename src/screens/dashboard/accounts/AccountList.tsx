import { A } from "@solidjs/router";
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
import AccountI from "../../../types/account";
import SiteHead from "../../../states/siteHead";
import reqGetAccountList from "../../../api/account/reqGetAccountList";
import { formatDatetime } from "../../../utils/formatDatetime";
import formatAccountRole from "../../../utils/formatAccountRole";
import Loading from "../../../components/loading/Loading";
import NoData from "../../../components/nodata/NoData";
import toast from "solid-toast";
import { PaginationI, paginationDefault } from "../../../types/api";

export default function AccountListScreen() {
  let bottomItemElRef: HTMLDivElement | undefined;

  const [isLoading, setIsLoading] = createSignal(false);
  const [accounts, setAccounts] = createSignal<AccountI[]>([]);

  const [lastId, setLastId] = createSignal("");
  const [pagination, setPagination] =
    createSignal<PaginationI>(paginationDefault);
  const isAllFetched = createMemo(() => {
    if (!isLoading() && accounts().length >= pagination().total) {
      return true;
    }
    return false;
  });

  createRenderEffect(() => {
    SiteHead.title = "Daftar Akun";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await reqGetAccountList({
        lastId: lastId(),
      });

      setAccounts((data) => [...data, ...res.json.data]);
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
    const id = accounts().at(-1)?.id;
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
        <h1 class="font-medium text-2xl">Daftar Akun</h1>
      </div>
      <div class="mx-6">
        <A
          href={SitePath.dashboardAccountCreate}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Tambah data
        </A>
      </div>
      <div class="flex-1 mt-8 px-6 flex flex-col">
        <Show when={accounts().length}>
          <table class="table-fixed border-collapse border border-slate-500 text-sm">
            <thead>
              <tr>
                <th class="p-2 border border-slate-600">Nama Lengkap</th>
                <th class="p-2 border border-slate-600">Nama Pengguna</th>
                <th class="p-2 border border-slate-600">Peran</th>
                <th class="p-2 border border-slate-600">
                  Waktu Akses Terakhir
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={accounts()}>
                {(p) => (
                  <tr>
                    <td class="p-2 border border-slate-700">
                      <A
                        href={SitePath.dashboardAccountDetail.replace(
                          ":id",
                          p.id
                        )}
                        class="underline"
                      >
                        {p.name}
                      </A>
                    </td>
                    <td class="p-2 border border-slate-700">{p.username}</td>
                    <td class="p-2 border border-slate-700">
                      {formatAccountRole(p.role)}
                    </td>
                    <td class="p-2 border border-slate-700">
                      {p.lastActivityTime
                        ? formatDatetime(p.lastActivityTime)
                        : "Belum ada aktivitas"}
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
        <Show when={!isLoading() && !accounts().length}>
          <NoData />
        </Show>
        <div ref={bottomItemElRef} />
      </div>
    </>
  );
}
