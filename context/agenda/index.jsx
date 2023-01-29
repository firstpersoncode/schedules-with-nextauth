import { createContext, useContext } from "react";
import useController, { initialContext } from "./controller";

const AgendaContext = createContext(initialContext);

export default function AgendaContextProvider({ children }) {
  const controlledContext = useController();
  return (
    <AgendaContext.Provider value={controlledContext}>
      {children}
    </AgendaContext.Provider>
  );
}

export const useAgendaContext = () => useContext(AgendaContext);
