import { createContext, useContext } from "react";
import useController, { initialContext } from "./controller";

const ReportContext = createContext(initialContext);

export default function ReportContextProvider({ children }) {
  const controlledContext = useController(initialContext);
  return (
    <ReportContext.Provider value={controlledContext}>
      {children}
    </ReportContext.Provider>
  );
}

export const useReportContext = () => useContext(ReportContext);
