import { createRenderEffect, createSignal } from "solid-js";
import SiteHead from "../states/siteHead";
import { useNavigate } from "@solidjs/router";
import SitePath from "../data/path";
import SiteInfo from "../data/info";
import reqSignIn from "../api/auth/reqSignIn";
import toast from "solid-toast";
import AccountAuth from "../states/accountAuth";

export default function SigninScreen() {
  let formRef: HTMLFormElement | undefined;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);

  createRenderEffect(() => {
    SiteHead.title = "Masuk";
  });

  async function signIn() {
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

      AccountAuth.data = {
        name: res.json.data.name,
        role: res.json.data.role,
      };

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
      <div class="w-fit mt-8 mx-auto">
        <form ref={formRef}>
          <div>
            <div>
              <span>Nama Pengguna</span>
            </div>
            <div class="mt-1">
              <input
                name="username"
                class="py-2 px-2.5 focus:outline-none focus:ring-4 focus:ring-light_sea_green/30 border border-2 border-netral-50 focus:border-light_sea_green rounded-lg"
              />
            </div>
          </div>
          <div class="mt-4">
            <div>
              <span>Kata Sandi</span>
            </div>
            <div class="mt-1">
              <input
                name="password"
                type="password"
                class="py-2 px-2.5 focus:outline-none focus:ring-4 focus:ring-light_sea_green/30 border border-2 border-netral-50 focus:border-light_sea_green rounded-lg"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="mt-6">
        <button
          type="button"
          onclick={signIn}
          class="block w-fit mx-auto px-32 py-2 bg-light_sea_green text-white rounded-xl"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}
