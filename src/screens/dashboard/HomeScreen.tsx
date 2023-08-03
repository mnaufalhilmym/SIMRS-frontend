import { For, Show, createRenderEffect, createSignal } from "solid-js";
import SiteHead from "../../states/siteHead";
import SettingI, { settingDefault } from "../../types/setting";
import reqGetSetting from "../../api/setting/reqGetSetting";
import toast from "solid-toast";
import SiteInfo from "../../data/info";
import Loading from "../../components/loading/Loading";
import DOMPurify from "dompurify";
import { marked } from "marked";
import styles from "../../styles/markdown.module.css";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = createSignal(false);
  const [setting, setSetting] = createSignal<SettingI>(settingDefault);

  createRenderEffect(() => {
    SiteHead.title = "Beranda";
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

  return (
    <>
      <div class="mx-6 my-4">
        <h1 class="font-medium text-2xl">Beranda</h1>
      </div>
      <div class="mt-8 px-6">
        <Show when={!isLoading()}>
          <Show when={setting().coverImg}>
            <div>
              <img
                src={setting().coverImg}
                class="block max-h-[36rem] mx-auto rounded-lg"
              />
            </div>
            <div class="mt-8">
              <span class="block font-semibold text-center text-2xl">
                {SiteInfo.institutionName}
              </span>
            </div>
          </Show>
          <Show when={setting().vision}>
            <div class="mt-4">
              <div>
                <div>
                  <span class="block font-semibold text-center text-xl">
                    Visi
                  </span>
                </div>
                <div class="w-fit mx-auto mt-1">
                  <p
                    innerHTML={DOMPurify.sanitize(
                      marked.parse(setting().vision ?? "")
                    )}
                    class={`text-justify break-words ${styles.content}`}
                  />
                </div>
              </div>
            </div>
          </Show>
          <Show when={setting().mission}>
            <div class="mt-4">
              <div>
                <div>
                  <span class="block font-semibold text-center text-xl">
                    Misi
                  </span>
                </div>
                <div class="w-fit mx-auto mt-1">
                  <p
                    innerHTML={DOMPurify.sanitize(
                      marked.parse(setting().mission ?? "")
                    )}
                    class={`text-justify break-words ${styles.content}`}
                  />
                </div>
              </div>
            </div>
          </Show>
          <Show when={setting().workers}>
            <div class="mt-4">
              <div>
                <span class="block font-semibold text-center text-xl">
                  Pegawai
                </span>
              </div>
              <div class="max-w-[40rem] mx-auto mt-1">
                <For each={setting().workers}>
                  {(w) => (
                    <div class="flex gap-x-2">
                      <div class="flex-1">
                        <span>{w.name}</span>
                      </div>
                      <div class="flex-1">
                        <span>{w.position}</span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </Show>
        <Show when={isLoading()}>
          <Loading />
        </Show>
      </div>
    </>
  );
}
