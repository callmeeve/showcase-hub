import Head from "next/head";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { InfinitySpin } from "react-loader-spinner";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Showcase projects website for Banyuwangi Developer"
        />
        <meta property="og:title" content="ShowcaseHub" />
        <meta
          property="og:description"
          content="Showcase projects website for Banyuwangi Developer"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://showcase-hub-rho.vercel.app/"
        />
        <meta property="og:site_name" content="ShowcaseHub" />
      </Head>
      <SessionProvider session={pageProps.session}>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <InfinitySpin visible={true} width="200" color="#06b6d4" />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  );
}
