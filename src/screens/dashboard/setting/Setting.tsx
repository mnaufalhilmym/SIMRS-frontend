import { For, Show, createRenderEffect, createSignal } from "solid-js";
import SettingI, { settingDefault } from "../../../types/setting";
import SiteHead from "../../../states/siteHead";
import toast from "solid-toast";
import reqGetSetting from "../../../api/setting/reqGetSetting";
import { A } from "@solidjs/router";
import SitePath from "../../../data/path";
import DOMPurify from "dompurify";
import { marked } from "marked";
import styles from "../../../styles/markdown.module.css";
import Loading from "../../../components/loading/Loading";

export default function SettingScreen() {
  const [isLoading, setIsLoading] = createSignal(false);
  const [setting, setSetting] = createSignal<SettingI>(settingDefault);

  createRenderEffect(() => {
    SiteHead.title = "Pengaturan";
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
      <div class="px-6 py-4">
        <h1 class="font-medium text-2xl">Pengaturan</h1>
      </div>
      <div class="mx-6">
        <A
          href={SitePath.dashboardSettingEdit}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Ubah
        </A>
      </div>
      <div class="mt-8 px-6">
        <Show when={setting() && !isLoading()}>
          <div class="space-y-4">
            <div>
              <div>
                <span>Gambar Sampul</span>
              </div>
              <div class="mt-1 w-full max-w-[40rem]">
                <img src={setting().coverImg} class="rounded-lg" />
              </div>
            </div>
            <div>
              <div>
                <span>Visi</span>
              </div>
              <div class="mt-1 w-full max-w-[40rem]">
                <div class="w-full py-2 px-4 bg-black/5 border border-black/30 rounded-lg">
                  <p
                    innerHTML={DOMPurify.sanitize(
                      marked.parse(setting().vision ?? "")
                    )}
                    class={`text-justify break-words ${styles.content}`}
                  />
                </div>
              </div>
            </div>
            <div>
              <div>
                <span>Misi</span>
              </div>
              <div class="mt-1 w-full max-w-[40rem]">
                <div class="w-full py-2 px-4 bg-black/5 border border-black/30 rounded-lg">
                  <p
                    innerHTML={DOMPurify.sanitize(
                      marked.parse(setting().mission ?? "")
                    )}
                    class={`text-justify break-words ${styles.content}`}
                  />
                </div>
              </div>
            </div>
            <For each={setting().workers}>
              {(w) => (
                <div class="flex gap-x-2 w-full max-w-[40rem]">
                  <div class="flex-1">
                    <TextItem title="Nama Pegawai" value={w.name} />
                  </div>
                  <div class="flex-1">
                    <TextItem title="Posisi" value={w.position} />
                  </div>
                </div>
              )}
            </For>
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
          <span class="block min-h-[1.5rem]">{props.value}</span>
        </div>
      </div>
    </div>
  );
}
