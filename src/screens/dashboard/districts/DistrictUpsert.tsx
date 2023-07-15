import { useNavigate, useParams } from "@solidjs/router";
import {
  Match,
  Show,
  Switch,
  createMemo,
  createRenderEffect,
  createSignal,
} from "solid-js";
import DistrictI, { districtDefault } from "../../../types/district";
import SiteHead from "../../../states/siteHead";
import reqGetDistrictDetail from "../../../api/district/reqGetDistrictDetail";
import SitePath from "../../../data/path";
import reqAddDistrict from "../../../api/district/reqAddDistrict";
import toast from "solid-toast";
import reqUpdateDistrict from "../../../api/district/reqUpdateDistrict";
import IconArrow from "../../../components/icon/Arrow";
import InputText from "../../../components/form/InputText";
import Loading from "../../../components/loading/Loading";

export default function DistrictUpsertScreen() {
  let formRef: HTMLFormElement | undefined;

  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [district, setDistrict] = createSignal<DistrictI>(districtDefault);

  const mode = createMemo(() => {
    if (params.id) {
      return "edit";
    } else {
      return "create";
    }
  });

  createRenderEffect(() => {
    if (mode() === "create") SiteHead.title = "Tambah Data Wilayah";
    else if (mode() === "edit") SiteHead.title = "Ubah Data Wilayah";
  });

  createRenderEffect(async () => {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const res = await reqGetDistrictDetail({ id: params.id });

      setDistrict(res.json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  });

  function navigateBack() {
    if (mode() === "create") {
      navigate(SitePath.dashboardDistrictList, { replace: true });
    } else if (mode() === "edit") {
      navigate(SitePath.dashboardDistrictDetail.replace(":id", params.id!), {
        replace: true,
      });
    }
  }

  async function onSave() {
    if (!formRef || isLoading()) return;

    if (!params.id) {
      await saveAddDistrict();
    } else {
      await saveEditDistrict();
    }
  }

  async function saveAddDistrict() {
    try {
      setIsLoading(true);

      const data = {
        name: (formRef as typeof formRef & { name: { value: string } }).name
          .value,
      };

      const res = await reqAddDistrict(data);

      toast.success("Data berhasil disimpan");

      navigate(
        SitePath.dashboardDistrictDetail.replace(":id", res.json.data.id),
        { replace: true }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveEditDistrict() {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const data = {
        id: params.id,
        name: (formRef as typeof formRef & { name: { value: string } }).name
          .value,
      };

      const res = await reqUpdateDistrict(data);

      toast.success("Data berhasil disimpan");

      navigate(
        SitePath.dashboardDistrictDetail.replace(":id", res.json.data.id),
        { replace: true }
      );
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
        <h1 class="font-medium text-2xl">
          <Switch>
            <Match when={mode() === "create"}>Tambah Data Wilayah</Match>
            <Match when={mode() === "edit"}>Ubah Data Wilayah</Match>
          </Switch>
        </h1>
      </div>
      <Show when={mode() === "create" || (mode() === "edit" && !isLoading())}>
        <div class="mt-2 px-6">
          <form ref={formRef} class="space-y-4">
            <InputTextItem
              title="Nama Wilayah"
              name="name"
              value={district().name}
              onChangeValue={(text) =>
                setDistrict((prev) => ({ ...prev, name: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
          </form>
        </div>
        <div class="mt-6 mx-6">
          <button
            type="button"
            onclick={onSave}
            class="block px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
          >
            Simpan
          </button>
        </div>
      </Show>
      <Show when={isLoading()}>
        <div class="mt-6 px-6">
          <Loading />
        </div>
      </Show>
    </>
  );
}

interface InputTextItemProps {
  title: string;
  name: string;
  value?: string;
  onChangeValue: (text: string) => void;
  outerClass?: string;
  inputClass?: string;
  isRequired?: boolean;
}

function InputTextItem(props: InputTextItemProps) {
  return (
    <div class={props.outerClass}>
      <div>
        <span>{props.title}</span>
        <Show when={props.isRequired}>
          <span class="text-candy_apple_red">*</span>
        </Show>
      </div>
      <div class={props.inputClass}>
        <InputText
          name={props.name}
          value={props.value}
          onChangeValue={props.onChangeValue}
        />
      </div>
    </div>
  );
}
