import { Outlet, useLocation, useNavigate } from "@solidjs/router";
import Footer from "../components/footer/Footer";
import { Show, createRenderEffect } from "solid-js";
import SiteInfo from "../data/info";
import SitePath from "../data/path";
import AccountAuth from "../states/accountAuth";
import { accountAuthDefault } from "../types/auth";
import reqAccountAuth from "../api/auth/reqAccountAuth";
import toast from "solid-toast";
import checkIsEqualPath from "../utils/checkIsEqualPath";

export default function MainWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  createRenderEffect(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      if (AccountAuth.data() === accountAuthDefault) {
        try {
          const res = await reqAccountAuth();
          if (!res) {
            localStorage.removeItem("token");
            navigate(SitePath.signin);
            return;
          }

          AccountAuth.data = res.json.data;
          if (
            checkIsEqualPath(SitePath.root, location.pathname) ||
            checkIsEqualPath(SitePath.signin, location.pathname)
          ) {
            navigate(SitePath.dashboard, { replace: true });
            return;
          }
        } catch (err) {
          console.error(err);
          toast.error(err as string);
        }
      }
    } else {
      if (
        !(
          checkIsEqualPath(SitePath.root, location.pathname) ||
          checkIsEqualPath(SitePath.signin, location.pathname)
        )
      ) {
        navigate(SitePath.signin, { replace: true });
        return;
      }
    }
  });

  return (
    <div class="min-h-screen flex flex-col">
      <div class="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Show when={SiteInfo.footerText}>
        <div class="pt-6">
          <Footer />
        </div>
      </Show>
    </div>
  );
}
