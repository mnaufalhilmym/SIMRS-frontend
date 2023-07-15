import { Outlet } from "@solidjs/router";
import Footer from "../components/footer/Footer";
import { Show } from "solid-js";
import SiteInfo from "../data/info";

export default function MainWrapper() {
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
