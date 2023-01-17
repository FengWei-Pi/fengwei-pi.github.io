import Head from "next/head";
import { Inter } from "@next/font/google";

import "styles/global.scss";


// Use Inter as font family.
// See https://nextjs.org/docs/basic-features/font-optimization.
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </main>
  );
}