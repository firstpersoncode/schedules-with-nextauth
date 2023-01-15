import { createContext, useContext, useEffect, useState } from "react";

const globalContext = {
  data: "",
};

const GlobalContext = createContext(globalContext);
const useContextController = (initialContext) => {
  const [ctx, setContext] = useState(initialContext);
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
  context: initialContext,
}) {
  const controlledContext = useContextController(initialContext);
  return (
    <GlobalContext.Provider value={controlledContext}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);
