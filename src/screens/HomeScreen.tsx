import { A } from "@solidjs/router";
import logo from "../data/logo";
import SitePath from "../data/path";
import { createRenderEffect } from "solid-js";
import SiteHead from "../states/siteHead";
import SiteInfo from "../data/info";

export default function HomeScreen() {
  createRenderEffect(() => {
    SiteHead.title = "";
  });

  return (
    <>
      <div class="w-fit pt-20 mx-auto">
        <img
          src={logo.logo_puskesmas.url}
          alt={logo.logo_puskesmas.alt}
          class="h-32"
        />
      </div>
      <div class="w-fit mt-12 mx-auto">
        <h1 class="font-medium text-center text-5xl leading-normal">
          Selamat datang di
          <br />
          Sistem Informasi Manajemen
          <br />
          <span class="text-light_sea_green">{SiteInfo.institutionName}</span>
        </h1>
      </div>
      <div class="w-fit my-24 mx-auto">
        <A
          href={SitePath.signin}
          class="px-32 py-2 bg-light_sea_green text-white rounded-xl"
        >
          Masuk
        </A>
      </div>
    </>
  );
}
