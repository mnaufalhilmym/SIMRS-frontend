import { For, Show, createRenderEffect, createSignal } from "solid-js";
import SettingI, { settingDefault } from "../../../types/setting";
import SiteHead from "../../../states/siteHead";
import reqGetSetting from "../../../api/setting/reqGetSetting";
import toast from "solid-toast";
import { useNavigate } from "@solidjs/router";
import SitePath from "../../../data/path";
import reqUpdateSetting from "../../../api/setting/reqUpdateSetting";
import IconArrow from "../../../components/icon/Arrow";
import InputText from "../../../components/form/InputText";
import MarkdownEditor from "../../../components/markdown/MarkdownEditor";
import Loading from "../../../components/loading/Loading";

export default function SettingEditScreen() {
  let formRef: HTMLFormElement | undefined;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [setting, setSetting] = createSignal<SettingI>(settingDefault);

  createRenderEffect(() => {
    SiteHead.title = "Ubah Pengaturan";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const res = await reqGetSetting();

      setSetting(res.json.data);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  });

  function navigateBack() {
    navigate(SitePath.dashboardSetting, { replace: true });
  }

  function updateCoverImg(
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) {
    const media = e.target as typeof e.target & {
      files: FileList;
      value: string;
    };

    if (!media.files.length) return;

    const imgFile = media.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setSetting((prev) => ({ ...prev, coverImg: reader.result as string }));
    };
    reader.readAsDataURL(imgFile);
  }

  async function saveEditSetting() {
    if (!formRef || isLoading()) return;

    try {
      setIsLoading(true);

      await reqUpdateSetting(setting());

      toast.success("Data berhasil disimpan");

      navigate(SitePath.dashboardSetting, { replace: true });
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
        <h1 class="font-medium text-2xl">Ubah Pengaturan</h1>
      </div>
      <Show when={!isLoading()}>
        <div class="mt-2 px-6">
          <form ref={formRef} class="space-y-4">
            <div>
              <div>
                <span>Gambar Sampul</span>
              </div>
              <div class="mt-1 w-full max-w-[40rem]">
                <div class="w-fit">
                  <input
                    id="update"
                    type="file"
                    onchange={updateCoverImg}
                    accept="image/*"
                    hidden
                  />
                  <label
                    for="update"
                    role="button"
                    class="block py-2 px-4 bg-black/5 border border-black/30 rounded-lg"
                  >
                    <Show when={setting().coverImg} fallback="Tambah">
                      Ubah
                    </Show>
                  </label>
                </div>
                <Show when={setting().coverImg}>
                  <div class="mt-2 w-full max-w-[40rem]">
                    <img src={setting().coverImg} class="rounded-lg" />
                  </div>
                </Show>
              </div>
            </div>
            <div>
              <div>
                <span>Visi</span>
              </div>
              <div class="mt-1 w-full max-w-[40rem]">
                <MarkdownEditor
                  name="vision"
                  value={setting().vision ?? ""}
                  setEditorVal={(val) =>
                    setSetting((prev) => ({ ...prev, vision: val }))
                  }
                />
              </div>
            </div>
            <div>
              <div>
                <span>Misi</span>
              </div>
              <div class="mt-1 w-full max-w-[40rem]">
                <MarkdownEditor
                  name="mission"
                  value={setting().mission ?? ""}
                  setEditorVal={(val) =>
                    setSetting((prev) => ({ ...prev, mission: val }))
                  }
                />
              </div>
            </div>
            <div class="mt-1 w-full max-w-[40rem] space-y-2">
              <For
                each={[
                  ...Array(
                    setting().workers ? setting().workers.length + 1 : 1
                  ).keys(),
                ]}
              >
                {(i) => (
                  <div class="flex gap-x-2">
                    <div>
                      <div>
                        <span>Nama Pegawai</span>
                      </div>
                      <div class="mt-1">
                        <InputText
                          name="employee_name"
                          value={setting().workers?.[i]?.name}
                          onChangeValue={(val) => {
                            if (setting().workers) {
                              if (setting().workers.length > i) {
                                setSetting((prev) => {
                                  const workers = prev.workers;
                                  workers[i].name = val;
                                  return { ...prev, workers };
                                });
                              } else {
                                setSetting((prev) => ({
                                  ...prev,
                                  workers: [
                                    ...prev.workers,
                                    { name: val, position: "" },
                                  ],
                                }));
                              }
                            } else {
                              setSetting((prev) => ({
                                ...prev,
                                workers: [{ name: val, position: "" }],
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <span>Posisi</span>
                      </div>
                      <div class="mt-1">
                        <InputText
                          name="employee_position"
                          value={setting().workers?.[i]?.position}
                          onChangeValue={(val) => {
                            if (setting().workers) {
                              if (setting().workers.length > i) {
                                setSetting((prev) => {
                                  const workers = prev.workers;
                                  workers[i].position = val;
                                  return { ...prev, workers };
                                });
                              } else {
                                setSetting((prev) => ({
                                  ...prev,
                                  workers: [
                                    ...prev.workers,
                                    { name: "", position: val },
                                  ],
                                }));
                              }
                            } else {
                              setSetting((prev) => ({
                                ...prev,
                                workers: [{ name: "", position: val }],
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </form>
        </div>
        <div class="mt-6 mx-6">
          <button
            type="button"
            onclick={saveEditSetting}
            class="block px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
          >
            Simpan
          </button>
        </div>
      </Show>
      <Show when={isLoading()}>
        <Loading />
      </Show>
    </>
  );
}
