import { createContext, useContext, useEffect, useState } from "react";
import useUserAgent from "hooks/useUserAgent";
import useIsMobile from "hooks/useIsMobile";

const globalContext = { userAgent: "" };

const GlobalContext = createContext(globalContext);
const useContextController = (context) => {
  const [ctx, setContext] = useState(context);

  const ua = useUserAgent(ctx.userAgent);
  const isMobile = useIsMobile(ua.isMobile);

  useEffect(() => {
    setContext((v) => ({ ...v, isClient: true }));
  }, []);

  return {
    ...ctx,
    isMobile,
    setContext,
  };
};

export default function GlobalContextProvider({
  children,
  context = globalContext,
}) {
  const controlledContext = useContextController(context);
  return (
    <GlobalContext.Provider value={controlledContext}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);

export function getGlobalContext(context) {
  return {
    userAgent: context.req.headers["user-agent"],
  };
}
