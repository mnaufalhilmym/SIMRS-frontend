import { useNavigate, useParams } from "@solidjs/router";
import {
  Match,
  Show,
  Switch,
  createMemo,
  createRenderEffect,
  createSignal,
} from "solid-js";
import AccountI, { AccountRoleE, accountDefault } from "../../../types/account";
import SiteHead from "../../../states/siteHead";
import reqGetAccountDetail from "../../../api/account/reqGetAccountDetail";
import SitePath from "../../../data/path";
import reqUpdateAccount from "../../../api/account/reqUpdateAccount";
import toast from "solid-toast";
import reqAddAccount from "../../../api/account/reqAddAccount";
import IconArrow from "../../../components/icon/Arrow";
import InputText from "../../../components/form/InputText";
import InputDropdown from "../../../components/form/InputDropdown";
import formatAccountRole from "../../../utils/formatAccountRole";

export default function AccountUpsertScreen() {
  let formRef: HTMLFormElement | undefined;

  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [account, setAccount] = createSignal<AccountI>(accountDefault);

  const mode = createMemo(() => {
    if (params.id) {
      return "edit";
    } else {
      return "create";
    }
  });

  createRenderEffect(() => {
    if (mode() === "create") SiteHead.title = "Tambah Data Akun";
    else if (mode() === "edit") SiteHead.title = "Ubah Data Akun";
  });

  createRenderEffect(async () => {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const res = await reqGetAccountDetail({ id: params.id });

      setAccount(res.json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  });

  function navigateBack() {
    if (mode() === "create") {
      navigate(SitePath.dashboardAccountList, { replace: true });
    } else if (mode() === "edit") {
      navigate(SitePath.dashboardAccountDetail.replace(":id", params.id!), {
        replace: true,
      });
    }
  }

  async function onSave() {
    if (!formRef || isLoading()) return;

    if (!params.id) {
      await saveAddAccount();
    } else {
      await saveEditAccount();
    }
  }

  async function saveAddAccount() {
    try {
      setIsLoading(true);

      const data = {
        name: (formRef as typeof formRef & { name: { value: string } }).name
          .value,
        username: (formRef as typeof formRef & { username: { value: string } })
          .username.value,
        password: (formRef as typeof formRef & { password: { value: string } })
          .password.value,
        role: (formRef as typeof formRef & { role: { value: AccountRoleE } })
          .role.value,
      };

      const res = await reqAddAccount(data);

      toast.success("Data berhasil disimpan");

      navigate(
        SitePath.dashboardAccountDetail.replace(":id", res.json.data.id),
        { replace: true }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveEditAccount() {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const data = {
        id: params.id,
        name: (formRef as typeof formRef & { name: { value: string } }).name
          .value,
        username: (formRef as typeof formRef & { username: { value: string } })
          .username.value,
        password: (formRef as typeof formRef & { password: { value: string } })
          .password.value,
        role: (formRef as typeof formRef & { role: { value: AccountRoleE } })
          .role.value,
      };

      const res = await reqUpdateAccount(data);

      toast.success("Data berhasil disimpan");

      navigate(
        SitePath.dashboardAccountDetail.replace(":id", res.json.data.id),
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
            <Match when={mode() === "create"}>Tambah Data Akun</Match>
            <Match when={mode() === "edit"}>Ubah Data Akun</Match>
          </Switch>
        </h1>
      </div>
      <div class="mt-2 px-6">
        <form ref={formRef} class="space-y-4">
          <InputTextItem
            title="Nama Lengkap"
            name="name"
            value={account().name}
            onChangeValue={(text) =>
              setAccount((prev) => ({ ...prev, name: text }))
            }
            inputClass="mt-1 w-full max-w-[40rem]"
            isRequired={mode() === "create"}
          />
          <InputTextItem
            title="Nama Pengguna"
            name="username"
            value={account().username}
            onChangeValue={(text) =>
              setAccount((prev) => ({ ...prev, username: text }))
            }
            inputClass="mt-1 w-full max-w-[40rem]"
            isRequired={mode() === "create"}
          />
          <div>
            <div>
              <span>Kata Sandi</span>
              <Show when={mode() === "create"}>
                <span class="text-candy_apple_red">*</span>
              </Show>
              <Show when={mode() === "edit"}>
                <span> (kosongi jika tidak ingin mengganti kata sandi)</span>
              </Show>
            </div>
            <div class="mt-1 w-full max-w-[40rem]">
              <InputText
                name="password"
                value={account().password}
                onChangeValue={(text) =>
                  setAccount((prev) => ({ ...prev, password: text }))
                }
              />
            </div>
          </div>
          <InputDropdownItem
            title="Peran"
            name="role"
            value={{
              title: formatAccountRole(account()!.role),
              value: account()!.role,
            }}
            onChangeValue={(text) =>
              setAccount((prev) => ({
                ...prev,
                role: text as AccountRoleE,
              }))
            }
            options={[
              {
                title: formatAccountRole(AccountRoleE.Admin),
                value: AccountRoleE.Admin,
              },
              {
                title: formatAccountRole(AccountRoleE.SuperAdmin),
                value: AccountRoleE.SuperAdmin,
              },
            ]}
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

interface InputDropdownItemProps {
  title: string;
  name: string;
  value?: { title: string; value: string };
  onChangeValue: (text: string) => void;
  placeholder?: string;
  options: { title: string; value: string }[];
  isRequired?: boolean;
}

function InputDropdownItem(props: InputDropdownItemProps) {
  return (
    <div>
      <div>
        <span>{props.title}</span>
        <Show when={props.isRequired}>
          <span class="text-candy_apple_red">*</span>
        </Show>
      </div>
      <div class="mt-1 w-full max-w-[40rem]">
        <InputDropdown
          name={props.name}
          value={props.value}
          onChangeValue={props.onChangeValue}
          options={props.options}
        />
      </div>
    </div>
  );
}
