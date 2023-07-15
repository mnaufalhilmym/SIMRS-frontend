import { createRenderEffect } from "solid-js";
import SiteHead from "../../states/siteHead";

export default function HomeScreen() {
  createRenderEffect(() => {
    SiteHead.title = "Beranda";
  });

  return (
    <>
      <div class="mx-6 my-4">
        <h1 class="font-medium text-2xl">Beranda</h1>
      </div>
    </>
  );
}
