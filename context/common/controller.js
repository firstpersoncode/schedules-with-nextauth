import { useEffect, useState, useCallback } from "react";
import useUserAgent from "hooks/useUserAgent";
import useIsMobile from "hooks/useIsMobile";

export const initialContext = {
  userAgent: "",
  isLoading: false,
  isClientSide: false,
  agendaDialog: false,
  eventDialog: false,
  drawer: false,
  infoDrawer: false,
};

const useController = (context) => {
  const [ctx, setContext] = useState(context);

  const ua = useUserAgent(ctx.userAgent);
  const isMobile = useIsMobile(ua.isMobile);

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
    setContext((v) => ({ ...v, isClientSide: true }));
  }, []);

  return {
    ...ctx,
    isMobile,
    setIsLoading,
    openAgendaDialog,
    closeAgendaDialog,
    openEventDialog,
    closeEventDialog,
    toggleDrawer,
    toggleInfoDrawer,
  };
};

export default useController;
