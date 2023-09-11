import { DocsThemeConfig } from "nextra-theme-docs";
import { Footer } from "./components/footer";
import { CarbonAd } from "./components/carbon-ad";

const config: DocsThemeConfig = {
  logo: <span>Feedr App</span>,
  project: {
    link: "https://github.com/sdepold/feedrapp",
  },
  docsRepositoryBase: "https://github.com/sdepold/feedrapp",
  footer: { text: <Footer /> },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Feedr App",
    };
  },
  toc: {
    extraContent: () => <CarbonAd />,
  },
};

export default config;
