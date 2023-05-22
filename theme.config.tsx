import { DocsThemeConfig } from "nextra-theme-docs";
import { Footer } from "./components/footer";

const config: DocsThemeConfig = {
  logo: <span>Feedr App</span>,
  project: {
    link: "https://github.com/shuding/nextra-docs-template",
  },
  docsRepositoryBase: "https://github.com/sdepold/feedrapp",
  footer: { text: <Footer /> },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Feedr App",
    };
  },
};

export default config;
