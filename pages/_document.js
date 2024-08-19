import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Showcase projects website for Banyuwangi Developer" />
        <meta property="og:title" content="ShowcaseHub" />
        <meta property="og:description" content="Showcase projects website for Banyuwangi Developer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://showcase-hub-rho.vercel.app/" />
        <meta property="og:site_name" content="ShowcaseHub" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
