import { Html, Head, Main, NextScript } from "next/document";
import { CssBaseline } from "@mui/material";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <CssBaseline />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
