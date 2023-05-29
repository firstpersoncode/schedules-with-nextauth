import "react-big-calendar/lib/css/react-big-calendar.css";
import "styles/globals.scss";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import CommonContextProvider from "context/common";

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
  });

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            left: 0,
            top: 0,
            zIndex: 10000,
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <CommonContextProvider>
        <Component {...pageProps} key={asPath} />
      </CommonContextProvider>
    </>
  );
}
