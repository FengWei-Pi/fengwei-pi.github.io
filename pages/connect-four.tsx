import Head from "next/head";

import { ConnectFour } from "components/connectFour";

export default function ConnectFourPage() {
  return (
    <>
      <Head>
        <title>Connect Four</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1 justify-content-center">
        <div className="flex-1 max-width flex-direction-col align-items-center">
          <ConnectFour />
        </div>
      </div>
    </>
  );
}
