import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function CarbonAd() {
  const pathname = usePathname();

  useEffect(() => {
    const isCarbonAdsRendered = document.querySelector("#carbonads");

    if (isCarbonAdsRendered) {
      (window as unknown as any)._carbonads.refresh();
    } else {
      const script = document.createElement("script");
      script.src =
        "//cdn.carbonads.com/carbon.js?serve=CWYDL53M&placement=feedrappinfo";
      script.id = "_carbonads_js";
      script.async = true;

      document.querySelectorAll("#carbon-container")[0].appendChild(script);
    }
  }, [pathname]);

  return <div id="carbon-container"></div>;
}
