import "../styles/global.scss";
import { Inter } from "@next/font/google";

// Use Inter as font family.
// See https://nextjs.org/docs/basic-features/font-optimization.
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}