import { DocsThemeConfig } from "nextra-theme-docs";
import { Footer } from "./components/footer";
import { EthicalAd } from "./components/ethical-ad";

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
    extraContent: () => <EthicalAd />,
  },
};

export default config;
