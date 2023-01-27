import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Views } from "react-big-calendar";
import { add, differenceInMinutes, isAfter, isBefore } from "date-fns";

export const repeats = { DAILY: "days", WEEKLY: "weeks", MONTHLY: "months" };
export const repeatOptions = [
  { title: "Daily", value: "DAILY" },
  { title: "Weekly", value: "WEEKLY" },
  { title: "Monthly", value: "MONTHLY" },
];

export const views = [
  { title: "Month", value: Views.MONTH },
  { title: "Week", value: Views.WEEK },
  { title: "Day", value: Views.DAY },
  { title: "Table", value: "table" },
  { title: "Report", value: "report" },
];

const timeLineTypes = [
  { title: "Availability", value: "AVAILABILITY", checked: true },
  { title: "Unavailability", value: "UNAVAILABILITY", checked: true },
  { title: "Others", value: "OTHERS", checked: true },
];

const statuses = [
  { title: "To Do", value: "TODO", checked: true },
  { title: "In Progress", value: "INPROGRESS", checked: true },
  { title: "Completed", value: "COMPLETED", checked: true },
];

const agendaContext = {
  agendas: [],
  agenda: null,
  agendaDialog: false,

  timeLines: [],
  timeLineDialog: false,
  timeLine: null,

  events: [],
  eventDialog: false,
  event: null,

  labels: [],

  timeLineTypes,
  statuses,
  view: views[0],

  cell: null,
  date: new Date(),

  isClient: false,
  isReady: false,
  isLoading: false,

  drawer: false,
  infoDrawer: false,
};

const AgendaContext = createContext(agendaContext);
const useContextController = (context) => {
  const [ctx, setContext] = useState(context);

  const getAgendaByTimeLine = useCallback(
    (timeLine) => {
      if (!timeLine) return;
      const selectedAgenda = ctx.agendas.find(
        (a) => a.id === timeLine.agendaId
      );
      return selectedAgenda;
    },
    [ctx.agendas]
  );

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
    setIsLoading(true);
    try {
      const res = await axios.post("/api/agenda/create", agenda);
      const newAgenda = res.data?.agenda;
      newAgenda.start = new Date(newAgenda.start);
      newAgenda.end = new Date(newAgenda.end);
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
    setIsLoading(false);
  }

  async function updateAgenda(agenda) {
    setIsLoading(true);
    try {
      const res = await axios.put("/api/agenda/update", agenda);
      const updatedAgenda = res.data?.agenda;
      updatedAgenda.start = new Date(updatedAgenda.start);
      updatedAgenda.end = new Date(updatedAgenda.end);

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
    setIsLoading(false);
  }

  async function deleteAgenda(agenda) {
    setIsLoading(true);
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
    setIsLoading(false);
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

  const getTimeLines = useCallback(() => {
    const checkedAgendas = ctx.agendas.filter((a) => a.checked);
    const checkedTypes = ctx.timeLineTypes.filter((s) => s.checked);

    return ctx.timeLines
      .filter((e) => checkedAgendas.find((a) => a.id === e.agendaId))
      .filter((e) => checkedTypes.find((s) => s.value === e.type));
  }, [ctx.timeLines, ctx.timeLineTypes, ctx.agendas]);

  async function addTimeLine({ agenda, ...timeLine }) {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/timeLine/create", {
        ...timeLine,
        agendaId: agenda.id,
      });

      const newTimeLineId = res.data?.timeLine;
      const newTimeLine = {
        id: newTimeLineId,
        agendaId: agenda.id,
        ...timeLine,
      };

      const currTimeLines = ctx.timeLines;
      currTimeLines.push(newTimeLine);

      setContext((v) => ({
        ...v,
        timeLines: currTimeLines,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  async function updateTimeLine(timeLine) {
    setIsLoading(true);
    try {
      await axios.put("/api/timeLine/update", timeLine);
      const currTimeLines = ctx.timeLines.map((e) => {
        if (e.id === timeLine.id) e = { ...e, ...timeLine };
        return e;
      });

      setContext((v) => ({
        ...v,
        timeLines: currTimeLines,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  async function deleteTimeLine(timeLine) {
    setIsLoading(true);
    try {
      await axios.delete(`/api/timeLine/delete?timeLineId=${timeLine.id}`);

      const currTimeLines = ctx.timeLines.filter((e) => e.id !== timeLine.id);

      setContext((v) => ({
        ...v,
        timeLines: currTimeLines,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  function openTimeLineDialog(timeLine, agenda) {
    setContext((v) => ({
      ...v,
      timeLineDialog: true,
      timeLine,
      agenda,
    }));
  }

  function closeTimeLineDialog() {
    setContext((v) => ({
      ...v,
      timeLineDialog: false,
      timeLine: null,
    }));
  }

  const duplicateRepeatedEvent = useCallback((agendaEnd, event) => {
    let events = [event];
    let eventStart = new Date(event.start);
    let eventEnd = new Date(event.end);
    const durationInMinutes = differenceInMinutes(eventEnd, eventStart);

    while (isBefore(eventStart, agendaEnd)) {
      eventStart = add(eventStart, {
        [repeats[event.repeat]]: 1,
      });

      if (isAfter(eventStart, agendaEnd)) break;

      eventEnd = add(eventStart, { minutes: durationInMinutes });

      const repeatedEvent = {
        ...event,
        start: eventStart,
        end: eventEnd,
        isDuplicate: true,
      };

      events.push(repeatedEvent);
    }

    if (event.cancelledAt.length) {
      events = events.filter((e) => {
        return !Boolean(
          event.cancelledAt.find((d) => {
            return new Date(d).getTime() === new Date(e.start).getTime();
          })
        );
      });
    }

    return events;
  }, []);

  const getEvents = useCallback(() => {
    if (!ctx.events.length) return [];
    let events = [...ctx.events];

    const checkedAgendas = ctx.agendas.filter((a) => a.checked);
    const checkedLabels = ctx.labels.filter((l) => l.checked);
    const checkedStatuses = ctx.statuses.filter((s) => s.checked);

    events.forEach((event) => {
      if (event.repeat) {
        events = events.filter((e) => e.id !== event.id);
        const agenda = getAgendaByEvent(event);
        const duplicates = duplicateRepeatedEvent(agenda.end, event);
        events = [...events, ...duplicates];
      }
    });

    return events
      .filter((e) => checkedAgendas.find((a) => a.id === e.agendaId))
      .filter(
        (e) =>
          !e.labels.length ||
          checkedLabels.find((l) => e.labels.find((el) => el.id === l.id))
      )
      .filter((e) => checkedStatuses.find((s) => s.value === e.status));
  }, [
    ctx.events,
    ctx.labels,
    ctx.statuses,
    ctx.agendas,
    getAgendaByEvent,
    duplicateRepeatedEvent,
  ]);

  async function addEvent({ agenda, ...event }) {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  async function updateEvent(event) {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  async function deleteEvent(event) {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  async function cancelEvent(event) {
    setIsLoading(true);
    try {
      await axios.put("/api/event/cancel", event);
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
    setIsLoading(false);
  }

  function openEventDialog(cell, event, agenda) {
    setContext((v) => ({
      ...v,
      cell,
      eventDialog: true,
      event,
      agenda,
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

  function setIsLoading(isLoading) {
    setContext((v) => ({
      ...v,
      isLoading,
    }));
  }

  function selectView(view) {
    const selectedView = views.find((p) => p.value === view);
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

  useEffect(() => {
    setContext((v) => ({ ...v, isClient: true }));
  }, []);

  useEffect(() => {
    if (!ctx.isClient) return;

    let persistCtx = {};
    const savedCtx = localStorage.getItem("ctx");
    if (savedCtx) {
      const { view } = JSON.parse(savedCtx);
      persistCtx.view = view;
    }

    setContext((v) => ({ ...v, ...persistCtx, isClient: true }));

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

        const timeLines = res.data?.timeLines.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        const events = res.data?.events.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        setContext((v) => ({
          ...v,
          agendas,
          timeLines,
          events,
          labels,
          agenda: agendas.length ? agendas[0] : null,
          isReady: true,
        }));
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [ctx.isClient]);

  useEffect(() => {
    if (!ctx.isClient) return;
    localStorage.setItem("ctx", JSON.stringify({ view: ctx.view }));
  }, [ctx.view, ctx.isClient]);

  return {
    ...ctx,
    getAgendaByTimeLine,
    getAgendaByEvent,
    selectAgenda,
    toggleCheckedAgenda,
    addAgenda,
    updateAgenda,
    deleteAgenda,
    openAgendaDialog,
    closeAgendaDialog,
    getTimeLines,
    addTimeLine,
    updateTimeLine,
    deleteTimeLine,
    openTimeLineDialog,
    closeTimeLineDialog,
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    cancelEvent,
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
