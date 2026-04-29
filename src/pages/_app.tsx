import type { AppProps } from "next/app";
import Head from "next/head";
import { Satisfy, Cormorant_Garamond } from "next/font/google";
import "@/styles/globals.css";

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Ståri</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Interaktiv norsk billedbok" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </Head>
      <div className={`${satisfy.variable} ${cormorant.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
