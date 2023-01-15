import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import "styles/globals.scss";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import TagManager from "react-gtm-module";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, LinearProgress } from "@mui/material";

export default function _App({ Component, pageProps }) {
  const { locale, asPath, events: RouterEvents } = useRouter();

  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef();

  useEffect(() => {
    const handleStart = (url) => {
      url !== `/${locale}${asPath}` && setLoading(true);
    };

    const handleComplete = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    RouterEvents.on("routeChangeStart", handleStart);
    RouterEvents.on("routeChangeComplete", handleComplete);
    RouterEvents.on("routeChangeError", handleComplete);

    return () => {
      RouterEvents.off("routeChangeStart", handleStart);
      RouterEvents.off("routeChangeComplete", handleComplete);
      RouterEvents.off("routeChangeError", handleComplete);
    };
  }, [locale, asPath]);

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
      {loading && (
        <Box sx={{ position: "fixed", width: "100%", left: 0, top: 0 }}>
          <LinearProgress />
        </Box>
      )}
      <Component {...pageProps} key={asPath} />
    </ThemeProvider>
  );
}
