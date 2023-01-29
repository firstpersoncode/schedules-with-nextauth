import { useEffect, useState } from "react";
import axios from "axios";
import useAgenda from "./agenda";
import useEvent from "./event";
import useCommon from "./common";

export const initialContext = {};

const useController = () => {
  const [ctx, setContext] = useState(initialContext);
  const commonState = useCommon();
  const agendaState = useAgenda({ ...commonState });
  const eventState = useEvent({
    ...commonState,
    ...agendaState,
  });
  const { setIsReady, setIsLoading } = commonState;
  const { setAgendas, selectAgenda, setLabels } = agendaState;
  const { setEvents } = eventState;

  useEffect(() => {
    setContext((v) => ({ ...v, isClient: true }));
  }, []);

  useEffect(() => {
    if (!ctx.isClient) return;

    (async () => {
      setIsLoading(true);
      try {
        const labels = [];
        const res = await axios.get("/api/agenda/list");
        const agendas = res.data?.agendas.map((a) => {
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

        setAgendas(agendas);
        selectAgenda(agendas.length ? agendas[0] : null);
        setLabels(labels);
        setEvents(events);
        setIsReady(true);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [
    ctx.isClient,
    setIsReady,
    setIsLoading,
    setAgendas,
    selectAgenda,
    setLabels,
    setEvents,
  ]);

  return {
    ...ctx,
    ...commonState,
    ...agendaState,
    ...eventState,
  };
};

export default useController;
