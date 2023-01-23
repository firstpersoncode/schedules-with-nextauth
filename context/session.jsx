import { createContext, useContext } from "react";

const sessionContext = {
  user: null,
};

const SessionContext = createContext(sessionContext);

export default function SessionContextProvider({ children, context }) {
  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext = () => useContext(SessionContext);
