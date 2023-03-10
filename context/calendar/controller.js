import { useState } from "react";
import { Views } from "react-big-calendar";

const views = [
  { title: "Month", value: Views.MONTH },
  { title: "Week", value: Views.WEEK },
  { title: "Day", value: Views.DAY },
];

export const initialContext = {
  view: views[0],
  date: new Date(),
};

const useController = (context) => {
  const [ctx, setContext] = useState(context);

  function selectView(view) {
    const selectedView = views.find((p) => p.value === view);
    setContext((v) => ({ ...v, view: selectedView }));
  }

  function selectDate(date) {
    setContext((v) => ({ ...v, date }));
  }

  return {
    ...ctx,
    selectView,
    selectDate,
  };
};

export default useController;
