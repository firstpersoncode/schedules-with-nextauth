import axios from "axios";
import { useEffect, useState, useCallback } from "react";

export const initialContext = {
  userAgent: "",
  isLoading: false,
  isClientSide: false,
  agendaDialog: false,
  eventDialog: false,
  drawer: false,
  infoDrawer: false,
  token: true,
};

const mobileSize = 992;

const useController = () => {
  const [ctx, setContext] = useState(initialContext);

  const setIsLoading = useCallback((isLoading) => {
    setContext((v) => ({
      ...v,
      isLoading,
    }));
  }, []);

  function openAgendaDialog() {
    setContext((v) => ({
      ...v,
      agendaDialog: true,
    }));
  }

  function closeAgendaDialog() {
    setContext((v) => ({
      ...v,
      agendaDialog: false,
    }));
  }

  function openEventDialog() {
    setContext((v) => ({
      ...v,
      eventDialog: true,
    }));
  }

  function closeEventDialog() {
    setContext((v) => ({
      ...v,
      eventDialog: false,
    }));
  }

  function toggleDrawer() {
    setContext((v) => ({ ...v, drawer: !v.drawer }));
  }

  function toggleInfoDrawer() {
    setContext((v) => ({ ...v, infoDrawer: !v.infoDrawer }));
  }

  useEffect(() => {
    setContext((v) => ({
      ...v,
      isClientSide: true,
      isMobile: window.innerWidth <= mobileSize,
    }));
  }, []);

  useEffect(() => {
    if (!ctx.isClientSide) return;

    const token = localStorage.getItem("token");
    if (!token) setContext((v) => ({ ...v, token }));
    else {
      (async () => {
        try {
          const resp = await axios.post("/api/token/validate", { key: token });
          if (!resp?.data?.key) throw new Error("invalid token");
          setContext((v) => ({ ...v, token: resp.data.key }));
        } catch (err) {
          console.error(err);
        }
      })();
    }

    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [ctx.isClientSide]);

  function handleWindowSizeChange(e) {
    setContext((v) => ({ ...v, isMobile: e.target.innerWidth <= mobileSize }));
  }

  return {
    ...ctx,
    setIsLoading,
    openAgendaDialog,
    closeAgendaDialog,
    openEventDialog,
    closeEventDialog,
    toggleDrawer,
    toggleInfoDrawer,
    setContext,
  };
};

export default useController;
