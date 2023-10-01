import type { AppProps } from "next/app";
import "../styles/ad.css";
import "../styles/ethical-ad.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
