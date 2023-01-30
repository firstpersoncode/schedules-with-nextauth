import { createContext, useContext } from "react";
import useController, { initialContext } from "./controller";

const BoardContext = createContext(initialContext);

export default function BoardContextProvider({ children }) {
  const controlledContext = useController(initialContext);
  return (
    <BoardContext.Provider value={controlledContext}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoardContext = () => useContext(BoardContext);
