import { useState } from "react";

const views = [
  { title: "Cards", value: "cards" },
  { title: "Table", value: "table" },
];

export const initialContext = {
  view: views[0],
};

const useController = (context) => {
  const [ctx, setContext] = useState(context);

  function selectView(view) {
    const selectedView = views.find((p) => p.value === view);
    setContext((v) => ({ ...v, view: selectedView }));
  }

  return {
    ...ctx,
    selectView,
  };
};

export default useController;
