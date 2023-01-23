import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Views } from "react-big-calendar";

const agendaContext = {
  agendas: [],
  agenda: null,
  agendaDialog: false,

  events: [],
  eventDialog: false,
  event: null,

  labels: [],

  statuses: [
    { title: "To Do", value: "TODO", checked: true },
    { title: "In Progress", value: "INPROGRESS", checked: true },
    { title: "Completed", value: "COMPLETED", checked: true },
  ],

  views: [
    { title: "Month", value: Views.MONTH },
    { title: "Week", value: Views.WEEK },
    { title: "Day", value: Views.DAY },
    { title: "Table", value: "table" },
  ],
  view: { title: "Month", value: Views.MONTH },

  cell: null,
  date: new Date(),

  isClient: false,
  isReady: false,

  drawer: false,
  infoDrawer: false,
};

const AgendaContext = createContext(agendaContext);
const useContextController = (context) => {
  const [ctx, setContext] = useState(context);

  useEffect(() => {
    setContext((v) => ({ ...v, isClient: true }));
  }, []);

  useEffect(() => {
    if (!ctx.isClient) return;
    const labels = [];

    (async () => {
      try {
        const res = await axios.get("/api/agenda/list");
        const agendas = res.data?.agendas.map((a) => {
          labels.push(...a.labels.map((l) => ({ ...l, checked: true })));
          return {
            ...a,
            start: new Date(a.start),
            end: a.end && new Date(a.end),
            checked: true,
          };
        });

        const events = res.data?.events.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        setContext((v) => ({
          ...v,
          agendas,
          events,
          labels,
          agenda: agendas.length ? agendas[0] : null,
          isReady: true,
        }));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [ctx.isClient]);

  const getAgendaByEvent = useCallback(
    (event) => {
      if (!event) return;
      const selectedAgenda = ctx.agendas.find((a) => a.id === event.agendaId);
      return selectedAgenda;
    },
    [ctx.agendas]
  );

  function selectAgenda(agenda) {
    setContext((v) => ({
      ...v,
      agenda,
    }));
  }

  function toggleCheckedAgenda(agenda, checked) {
    const currAgendas = ctx.agendas.map((a) => {
      if (a.id === agenda.id) {
        a.checked = checked;
      }

      return a;
    });

    setContext((v) => ({ ...v, agendas: currAgendas }));
  }

  async function addAgenda(agenda) {
    try {
      const res = await axios.post("/api/agenda/create", agenda);
      const newAgenda = res.data?.agenda;
      newAgenda.start = new Date(newAgenda.start);
      if (newAgenda.end) newAgenda.end = new Date(newAgenda.end);
      newAgenda.checked = true;

      const currAgendas = ctx.agendas;
      currAgendas.push(newAgenda);
      const labels = ctx.labels;
      labels.push(...newAgenda.labels.map((l) => ({ ...l, checked: true })));

      setContext((v) => ({
        ...v,
        agendas: currAgendas,
        labels,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function updateAgenda(agenda) {
    try {
      const res = await axios.put("/api/agenda/update", agenda);
      const updatedAgenda = res.data?.agenda;
      updatedAgenda.start = new Date(updatedAgenda.start);
      if (updatedAgenda.end) updatedAgenda.end = new Date(updatedAgenda.end);

      const currAgendas = ctx.agendas.map((e) => {
        if (e.id === updatedAgenda.id) e = { ...e, ...updatedAgenda };
        return e;
      });

      const labels = ctx.labels.map((l) => {
        const updatedLabel = updatedAgenda.labels.find((el) => el.id === l.id);
        if (updatedLabel) l = { ...l, ...updatedLabel, checked: true };
        return l;
      });

      const newLabels = updatedAgenda.labels.filter(
        (l) => !Boolean(labels.find((el) => el.id === l.id))
      );

      if (newLabels.length)
        labels.push(...newLabels.map((l) => ({ ...l, checked: true })));

      setContext((v) => ({
        ...v,
        agendas: currAgendas,
        labels,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteAgenda(agenda) {
    try {
      await axios.delete(`/api/agenda/delete?agendaId=${agenda.id}`);

      const currAgendas = ctx.agendas.filter((e) => e.id !== agenda.id);
      const currEvents = ctx.events.filter((e) => e.agendaId !== agenda.id);
      const currLabels = ctx.labels.filter((e) => e.agendaId !== agenda.id);

      setContext((v) => ({
        ...v,
        agendas: currAgendas,
        events: currEvents,
        labels: currLabels,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  function openAgendaDialog(agenda) {
    setContext((v) => ({
      ...v,
      agendaDialog: true,
      agenda,
    }));
  }

  function closeAgendaDialog() {
    setContext((v) => ({
      ...v,
      agendaDialog: false,
      agenda: null,
    }));
  }

  const getEvents = useCallback(() => {
    const checkedAgendas = ctx.agendas.filter((a) => a.checked);
    const checkedLabels = ctx.labels.filter((l) => l.checked);
    const checkedStatuses = ctx.statuses.filter((s) => s.checked);

    return ctx.events
      .filter((e) => checkedAgendas.find((a) => a.id === e.agendaId))
      .filter(
        (e) =>
          !e.labels.length ||
          checkedLabels.find((l) => e.labels.find((el) => el.id === l.id))
      )
      .filter((e) => checkedStatuses.find((s) => s.value === e.status));
  }, [ctx.events, ctx.labels, ctx.statuses, ctx.agendas]);

  async function addEvent({ agenda, ...event }) {
    try {
      const res = await axios.post("/api/event/create", {
        ...event,
        agendaId: agenda.id,
      });

      const newEventId = res.data?.event;
      const newEvent = {
        id: newEventId,
        agendaId: agenda.id,
        ...event,
      };

      const currEvents = ctx.events;
      currEvents.push(newEvent);

      setContext((v) => ({
        ...v,
        events: currEvents,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function updateEvent(event) {
    try {
      await axios.put("/api/event/update", event);
      const currEvents = ctx.events.map((e) => {
        if (e.id === event.id) e = { ...e, ...event };
        return e;
      });

      setContext((v) => ({
        ...v,
        events: currEvents,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteEvent(event) {
    try {
      await axios.delete(`/api/event/delete?eventId=${event.id}`);

      const currEvents = ctx.events.filter((e) => e.id !== event.id);

      setContext((v) => ({
        ...v,
        events: currEvents,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  function openEventDialog(cell, event) {
    setContext((v) => ({
      ...v,
      eventDialog: true,
      event,
      cell,
    }));
  }

  function closeEventDialog() {
    setContext((v) => ({
      ...v,
      eventDialog: false,
      event: null,
      cell: null,
    }));
  }

  const getLabelsByAgenda = useCallback(
    (agenda) => ctx.labels.filter((l) => l.agendaId === agenda.id),
    [ctx.labels]
  );

  function toggleCheckedLabel(label, checked) {
    const currLabels = ctx.labels.map((l) => {
      if (l.id === label.id) {
        l.checked = checked;
      }

      return l;
    });

    setContext((v) => ({ ...v, labels: currLabels }));
  }

  function selectView(view) {
    const selectedView = ctx.views.find((p) => p.value === view);
    setContext((v) => ({ ...v, view: selectedView }));
  }

  function selectDate(date) {
    setContext((v) => ({ ...v, date }));
  }

  function toggleIsTable() {
    setContext((v) => ({ ...v, isTable: !v.isTable }));
  }

  function toggleDrawer() {
    setContext((v) => ({ ...v, drawer: !v.drawer }));
  }

  function toggleInfoDrawer() {
    setContext((v) => ({ ...v, infoDrawer: !v.infoDrawer }));
  }

  function toggleEventStatuses(status, checked) {
    const currStatuses = ctx.statuses.map((s) => {
      if (s.value === status.value) {
        s.checked = checked;
      }

      return s;
    });

    setContext((v) => ({ ...v, statuses: currStatuses }));
  }

  return {
    ...ctx,
    getAgendaByEvent,
    selectAgenda,
    toggleCheckedAgenda,
    addAgenda,
    updateAgenda,
    deleteAgenda,
    openAgendaDialog,
    closeAgendaDialog,
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    openEventDialog,
    closeEventDialog,
    getLabelsByAgenda,
    toggleCheckedLabel,
    selectView,
    selectDate,
    toggleIsTable,
    toggleDrawer,
    toggleInfoDrawer,
    toggleEventStatuses,
  };
};

export default function AgendaContextProvider({
  children,
  context = agendaContext,
}) {
  const controlledContext = useContextController(context);
  return (
    <AgendaContext.Provider value={controlledContext}>
      {children}
    </AgendaContext.Provider>
  );
}

export const useAgendaContext = () => useContext(AgendaContext);
