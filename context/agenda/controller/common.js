import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Views } from "react-big-calendar";

export const views = [
  { title: "Month", value: Views.MONTH },
  { title: "Week", value: Views.WEEK },
  { title: "Day", value: Views.DAY },
  { title: "Report", value: "report" },
];

const initialState = {
  view: views[0],
  cell: null,
  date: new Date(),

  isClient: false,
  isReady: false,
  isLoading: false,

  drawer: false,
  infoDrawer: false,
};

const useCommon = () => {
  const [state, setState] = useState(initialState);

  const setIsLoading = useCallback((isLoading) => {
    setState((v) => ({
      ...v,
      isLoading,
    }));
  }, []);

  const setIsReady = useCallback((isReady) => {
    setState((v) => ({
      ...v,
      isReady,
    }));
  }, []);

  function selectCell(cell) {
    setState((v) => ({ ...v, cell }));
  }

  function selectView(view) {
    const selectedView = views.find((p) => p.value === view);
    setState((v) => ({ ...v, view: selectedView }));
  }

  function selectDate(date) {
    setState((v) => ({ ...v, date }));
  }

  function toggleDrawer() {
    setState((v) => ({ ...v, drawer: !v.drawer }));
  }

  function toggleInfoDrawer() {
    setState((v) => ({ ...v, infoDrawer: !v.infoDrawer }));
  }

  useEffect(() => {
    // if (!state.isReady) return;
    const savedCtx = localStorage.getItem("ctx.view");
    if (savedCtx) {
      const { view } = JSON.parse(savedCtx);
      setState((v) => ({ ...v, view }));
    }
  }, [state.isReady]);

  useEffect(() => {
    if (!state.isReady) return;
    localStorage.setItem("ctx.view", JSON.stringify({ view: state.view }));
  }, [state.isReady, state.view]);

  return {
    ...state,
    setIsLoading,
    setIsReady,
    selectCell,
    selectView,
    selectDate,
    toggleDrawer,
    toggleInfoDrawer,
  };
};

export default useCommon;
