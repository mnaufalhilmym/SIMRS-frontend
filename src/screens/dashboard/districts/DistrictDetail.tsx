import { A, useNavigate, useParams } from "@solidjs/router";
import { Show, createRenderEffect, createSignal } from "solid-js";
import SiteHead from "../../../states/siteHead";
import DistrictI from "../../../types/district";
import reqGetDistrictDetail from "../../../api/district/reqGetDistrictDetail";
import SitePath from "../../../data/path";
import reqDeleteDistrict from "../../../api/district/reqDeleteDistrict";
import IconArrow from "../../../components/icon/Arrow";
import Loading from "../../../components/loading/Loading";

export default function DistrictDetailScreen() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [district, setDistrict] = createSignal<DistrictI>();

  createRenderEffect(() => {
    SiteHead.title = "Detail Wilayah";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await reqGetDistrictDetail({ id: params.id });

      if (!res.status.toString().startsWith("2")) {
        navigate(SitePath.dashboardDistrictList, { replace: true });
      }

      setDistrict(res.json.data);
    } catch (err) {
      console.error(err);
      navigate(SitePath.dashboardDistrictList, { replace: true });
    } finally {
      setIsLoading(false);
    }
  });

  function navigateBack() {
    navigate(SitePath.dashboardDistrictList, { replace: true });
  }

  async function deleteDistrict() {
    try {
      setIsLoading(true);

      await reqDeleteDistrict({ id: params.id });

      navigate(SitePath.dashboardDistrictList, { replace: true });
    } catch (err) {
      console.error(err);
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
        <h1 class="font-medium text-2xl">Detail Wilayah</h1>
      </div>
      <div class="mx-6 flex gap-x-2">
        <A
          href={SitePath.dashboardDistrictEdit.replace(":id", params.id)}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Ubah
        </A>
        <button
          type="button"
          onclick={deleteDistrict}
          class="block w-fit px-4 py-2 bg-candy_apple_red text-white rounded-lg text-sm"
        >
          Hapus
        </button>
      </div>
      <div class="mt-8 px-6">
        <Show when={district()}>
          <div class="space-y-4">
            <TextItem title="Nama Wilayah" value={district()!.name} />
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
