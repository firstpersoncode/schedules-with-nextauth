import { createContext, useContext } from "react";
import useController, { initialContext } from "./controller";

const CommonContext = createContext(initialContext);

export default function CommonContextProvider({ children, context }) {
  const controlledContext = useController(context);
  return (
    <CommonContext.Provider value={controlledContext}>
      {children}
    </CommonContext.Provider>
  );
}

export const useCommonContext = () => useContext(CommonContext);

export function getCommonContext(context) {
  return {
    userAgent: context.req.headers["user-agent"],
  };
}
