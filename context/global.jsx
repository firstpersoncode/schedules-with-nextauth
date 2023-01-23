import { createContext, useContext, useEffect, useState } from "react";

const globalContext = { userAgent: "" };

const GlobalContext = createContext(globalContext);
const useContextController = (context) => {
  const [ctx, setContext] = useState(context);
  useEffect(() => {
    setContext((v) => ({ ...v, isClient: true }));
  }, []);

  return {
    ...ctx,
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
