import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Feedr App</span>,
  project: {
    link: "https://github.com/shuding/nextra-docs-template",
  },
  docsRepositoryBase: "https://github.com/sdepold/feedrapp",
  footer: {
    text: (
      <>
        MIT {new Date().getFullYear()} ©&nbsp;
        <a href="https://depold.com" target="_blank">
          Sascha Depold
        </a>
      </>
    ),
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Feedr App",
    };
  },
};

export default config;
