import { MetaProvider, Title } from "@solidjs/meta";
import SiteHead from "../../states/siteHead";

export default function Head() {
  return (
    <MetaProvider>
      <Title>{SiteHead.title()}</Title>
    </MetaProvider>
  );
}
