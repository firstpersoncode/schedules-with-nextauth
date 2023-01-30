import { useEffect } from "react";
import axios from "axios";
import { useCommonContext } from "context/common";
import useAgenda from "./agenda";
import useEvent from "./event";

export const initialContext = {};

const useController = () => {
  const { isReady, setIsLoading } = useCommonContext();
  const agendaState = useAgenda();
  const eventState = useEvent({ ...agendaState });
  const { setAgendaOptions, setAgendas, selectAgenda, setLabels, setStatuses } =
    agendaState;
  const { setEvents } = eventState;

  useEffect(() => {
    if (!isReady) return;

    (async () => {
      setIsLoading(true);
      try {
        const statuses = [];
        const labels = [];
        const res = await axios.get("/api/agenda/list");
        const agendas = res.data?.agendas.map((a) => {
          statuses.push(...a.statuses.map((s) => ({ ...s, checked: true })));
          labels.push({
            title: "No label",
            color: "#CCC",
            agendaId: a.id,
            checked: true,
          });
          labels.push(...a.labels.map((l) => ({ ...l, checked: true })));

          return {
            ...a,
            start: new Date(a.start),
            end: new Date(a.end),
            checked: true,
          };
        });

        const events = res.data?.events.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        setAgendaOptions(agendas);
        setStatuses(statuses);
        setLabels(labels);
        setEvents(events);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [
    isReady,
    setIsLoading,
    setAgendaOptions,
    setLabels,
    setStatuses,
    setEvents,
  ]);

  return {
    ...agendaState,
    ...eventState,
  };
};

export default useController;
