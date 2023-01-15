import { createContext, useContext, useEffect, useState } from "react";

const scheduleContext = {
  data: "",
};

const ScheduleContext = createContext(scheduleContext);
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

export default function ScheduleContextProvider({
  children,
  context: initialContext,
}) {
  const controlledContext = useContextController(initialContext);
  return (
    <ScheduleContext.Provider value={controlledContext}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useScheduleContext = () => useContext(ScheduleContext);
