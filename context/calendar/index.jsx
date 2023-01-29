import { createContext, useContext } from "react";
import useController, { initialContext } from "./controller";

const CalendarContext = createContext(initialContext);

export default function CalendarContextProvider({ children }) {
  const controlledContext = useController(initialContext);
  return (
    <CalendarContext.Provider value={controlledContext}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendarContext = () => useContext(CalendarContext);
