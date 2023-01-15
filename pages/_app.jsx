import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import "styles/globals.scss";

import { useRouter } from "next/router";
import { useEffect } from "react";
import TagManager from "react-gtm-module";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function _App({ Component, pageProps }) {
  const { asPath } = useRouter();

  useEffect(() => {
    if (process.env.GTM_ID && !window.GTM_INITIALIZED) {
      TagManager.initialize({ gtmId: process.env.GTM_ID });
      window.GTM_INITIALIZED = true;
    }
  }, []);

  return (
    <ThemeProvider
      theme={createTheme({
        // palette: {
        //   primary: {
        //     light: "#edf6ff",
        //     main: "#0084ff",
        //     dark: "#0c004a",
        //   },
        //   secondary: {
        //     light: "#fffde8",
        //     main: "#bdad00",
        //     dark: "#544d00",
        //   },
        // },
      })}
    >
      <Component {...pageProps} key={asPath} />
    </ThemeProvider>
  );
}
