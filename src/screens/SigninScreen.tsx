import { Show, createRenderEffect, createSignal } from "solid-js";
import SiteHead from "../states/siteHead";
import { useNavigate } from "@solidjs/router";
import SitePath from "../data/path";
import SiteInfo from "../data/info";
import reqSignIn from "../api/auth/reqSignIn";
import toast from "solid-toast";
import AccountAuth from "../states/accountAuth";
import LoadingSpinner from "../components/loading/LoadingSpinner";

export default function SigninScreen() {
  let formRef: HTMLFormElement | undefined;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);

  createRenderEffect(() => {
    SiteHead.title = "Masuk";
  });

  async function signIn(e: Event) {
    e.preventDefault();

    if (isLoading()) return;

    try {
      setIsLoading(true);

      const data = {
        username: (formRef as typeof formRef & { username: { value: string } })
          .username.value,
        password: (formRef as typeof formRef & { password: { value: string } })
          .password.value,
      };

      const res = await reqSignIn(data);

      localStorage.setItem("token", res.json.data.token);
      AccountAuth.data = res.json.data;

      navigate(SitePath.dashboard);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div class="flex-1 flex flex-col justify-center">
      <div>
        <h1 class="font-medium text-light_sea_green text-2xl text-center">
          Masuk
          <br />
          SIM {SiteInfo.institutionName}
        </h1>
      </div>
      <div class="w-full max-w-[24rem] mt-8 mx-auto">
        <form ref={formRef} onsubmit={signIn}>
          <div>
            <div>
              <span>Nama Pengguna</span>
            </div>
            <div class="mt-1">
              <input
                name="username"
                class="w-full py-2 px-2.5 focus:outline-none focus:ring-4 focus:ring-light_sea_green/30 border border-2 border-netral-50 focus:border-light_sea_green rounded-lg"
              />
            </div>
          </div>
          <div class="w-96 mt-4">
            <div>
              <span>Kata Sandi</span>
            </div>
            <div class="mt-1">
              <input
                name="password"
                type="password"
                class="w-full py-2 px-2.5 focus:outline-none focus:ring-4 focus:ring-light_sea_green/30 border border-2 border-netral-50 focus:border-light_sea_green rounded-lg"
              />
            </div>
          </div>
          <div class="mt-6">
            <button
              type="submit"
              class="block w-full max-w-[24rem] mx-auto px-2.5 py-2 bg-light_sea_green text-white rounded-xl"
            >
              <Show
                when={!isLoading()}
                fallback={<LoadingSpinner class="w-6 h-6 mx-auto" />}
              >
                Masuk
              </Show>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
