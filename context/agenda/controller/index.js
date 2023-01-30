import { useEffect, useState } from "react";
import axios from "axios";
import { useCommonContext } from "context/common";
import useAgenda from "./agenda";
import useEvent from "./event";

export const initialContext = {
  agendaReady: false,
};

const useController = (context) => {
  const { isClientSide, setIsLoading } = useCommonContext();
  const agendaState = useAgenda();
  const eventState = useEvent({ ...agendaState });
  const {
    setAgendaOptions,
    setAgendas,
    setLabels,
    setStatuses,
    agendas,
    labels,
    statuses,
  } = agendaState;
  const { setEvents } = eventState;
  const [ctx, setContext] = useState(context);

  useEffect(() => {
    if (!isClientSide) return;

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

        const persistAgendaIds = localStorage.getItem("agenda.agendas");
        if (persistAgendaIds) {
          const ids = JSON.parse(persistAgendaIds);
          if (ids.length) {
            setAgendas(
              ids
                .filter((agenda) => agendas.find((a) => a.id === agenda.id))
                .map((agenda) => {
                  const matchAgenda = agendas.find((a) => a.id === agenda.id);

                  return {
                    ...matchAgenda,
                    checked: agenda.checked,
                  };
                })
            );

            setAgendaOptions(
              agendas.filter((a) => !ids.map((a) => a.id).includes(a.id))
            );
          }
        }

        const persistLabelIds = localStorage.getItem("agenda.labels");
        if (persistLabelIds) {
          const ids = JSON.parse(persistLabelIds);
          if (ids.length)
            setLabels(
              ids
                .filter((label) =>
                  labels.find(
                    (a) => a.id === label.id && a.agendaId === label.agendaId
                  )
                )
                .map((label) => {
                  const matchLabel = labels.find(
                    (a) => a.id === label.id && a.agendaId === label.agendaId
                  );

                  return {
                    ...matchLabel,
                    checked: label.checked,
                  };
                })
            );
        }

        const persistStatusIds = localStorage.getItem("agenda.statuses");
        if (persistStatusIds) {
          const ids = JSON.parse(persistStatusIds);
          if (ids.length)
            setStatuses(
              ids
                .filter((status) =>
                  statuses.find(
                    (a) => a.id === status.id && a.agendaId === status.agendaId
                  )
                )
                .map((status) => {
                  const matchStatus = statuses.find(
                    (a) => a.id === status.id && a.agendaId === status.agendaId
                  );

                  return {
                    ...matchStatus,
                    checked: status.checked,
                  };
                })
            );
        }

        setContext((v) => ({ ...v, agendaReady: true }));
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [
    isClientSide,
    setIsLoading,
    setAgendaOptions,
    setAgendas,
    setLabels,
    setStatuses,
    setEvents,
  ]);

  useEffect(() => {
    if (ctx.agendaReady) {
      localStorage.setItem(
        "agenda.agendas",
        JSON.stringify(agendas.map((a) => ({ id: a.id, checked: a.checked })))
      );

      localStorage.setItem(
        "agenda.labels",
        JSON.stringify(
          labels.map((a) => ({
            id: a.id,
            agendaId: a.agendaId,
            checked: a.checked,
          }))
        )
      );

      localStorage.setItem(
        "agenda.statuses",
        JSON.stringify(
          statuses.map((a) => ({
            id: a.id,
            agendaId: a.agendaId,
            checked: a.checked,
          }))
        )
      );
    }
  }, [ctx.agendaReady, agendas, labels, statuses]);

  return {
    ...ctx,
    ...agendaState,
    ...eventState,
  };
};

export default useController;
