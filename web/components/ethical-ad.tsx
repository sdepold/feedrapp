import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function EthicalAd() {
  const pathname = usePathname();

  useEffect(() => {
    const isEthicalAdsRendered = document.querySelector(".ea-content");

    if (isEthicalAdsRendered) {
      (window as unknown as any).ethicalads.reload();
    } else {
      const script = document.createElement("script");
      script.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
      script.async = true;

      document.querySelector("body").appendChild(script);
    }
  }, [pathname]);

  return <div data-ea-publisher="feedrappinfo" data-ea-type="image"></div>;
}
