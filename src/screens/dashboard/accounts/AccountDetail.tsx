import { A, useNavigate, useParams } from "@solidjs/router";
import { Show, createRenderEffect, createSignal } from "solid-js";
import AccountI from "../../../types/account";
import SiteHead from "../../../states/siteHead";
import reqGetAccountDetail from "../../../api/account/reqGetAccountDetail";
import SitePath from "../../../data/path";
import reqDeleteAccount from "../../../api/account/reqDeleteAccount";
import IconArrow from "../../../components/icon/Arrow";
import formatAccountRole from "../../../utils/formatAccountRole";
import { formatDatetime } from "../../../utils/formatDatetime";
import Loading from "../../../components/loading/Loading";
import toast from "solid-toast";

export default function AccountDetailScreen() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [account, setAccount] = createSignal<AccountI>();

  createRenderEffect(() => {
    SiteHead.title = "Detail Akun";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await reqGetAccountDetail({ id: params.id });

      if (!res.status.toString().startsWith("2")) {
        navigate(SitePath.dashboardAccountList, { replace: true });
      }

      setAccount(res.json.data);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
      navigate(SitePath.dashboardAccountList, { replace: true });
    } finally {
      setIsLoading(false);
    }
  });

  function navigateBack() {
    navigate(SitePath.dashboardAccountList, { replace: true });
  }

  async function deleteAccount() {
    try {
      setIsLoading(true);

      await reqDeleteAccount({ id: params.id });

      navigate(SitePath.dashboardAccountList, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div class="px-6 py-4 flex items-center gap-x-2">
        <button onclick={navigateBack}>
          <IconArrow class="w-6 h-6" direction="back" />
        </button>
        <h1 class="font-medium text-2xl">Detail Akun</h1>
      </div>
      <div class="mx-6 flex gap-x-2">
        <A
          href={SitePath.dashboardAccountEdit.replace(":id", params.id)}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Ubah
        </A>
        <button
          type="button"
          onclick={deleteAccount}
          class="block w-fit px-4 py-2 bg-candy_apple_red text-white rounded-lg text-sm"
        >
          Hapus
        </button>
      </div>
      <div class="mt-8 px-6">
        <Show when={account() && !isLoading()}>
          <div class="space-y-4">
            <TextItem title="Nama Lengkap" value={account()!.name} />
            <TextItem title="Nama Pengguna" value={account()!.username} />
            <TextItem
              title="Peran"
              value={formatAccountRole(account()!.role)}
            />
            <TextItem
              title="Waktu Dibuat"
              value={formatDatetime(account()!.createdAt)}
            />
            <TextItem
              title="Waktu Akses Terakhir"
              value={
                account()!.lastActivityTime
                  ? formatDatetime(account()!.lastActivityTime!)
                  : "Belum ada aktivitas"
              }
            />
          </div>
        </Show>
        <Show when={isLoading()}>
          <Loading />
        </Show>
      </div>
    </>
  );
}

interface TextItemProps {
  title: string;
  value: string;
}

function TextItem(props: TextItemProps) {
  return (
    <div>
      <div>
        <span>{props.title}</span>
      </div>
      <div class="mt-1 w-full max-w-[40rem]">
        <div class="w-full py-2 px-4 bg-black/5 border border-black/30 rounded-lg">
          <span>{props.value}</span>
        </div>
      </div>
    </div>
  );
}
