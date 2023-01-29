import { useCallback, useState } from "react";
import axios from "axios";
import { add, differenceInMinutes, isAfter, isBefore } from "date-fns";

export const repeats = { DAILY: "days", WEEKLY: "weeks", MONTHLY: "months" };
export const repeatOptions = [
  { title: "Daily", value: "DAILY" },
  { title: "Weekly", value: "WEEKLY" },
  { title: "Monthly", value: "MONTHLY" },
];

const statuses = [
  { title: "To Do", value: "TODO", checked: true },
  { title: "In Progress", value: "INPROGRESS", checked: true },
  { title: "Completed", value: "COMPLETED", checked: true },
];

const initialState = {
  events: [],
  eventDialog: false,
  event: null,
  statuses,
};

const useEvent = ({
  selectCell,
  setIsLoading,
  agendas,
  labels,
  selectAgenda,
  getAgendaByEvent,
}) => {
  const [state, setState] = useState(initialState);

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
    if (!state.events.length) return [];
    let events = [...state.events];

    const checkedAgendas = agendas.filter((a) => a.checked);
    const checkedLabels = labels.filter((l) => l.checked);
    const checkedStatuses = state.statuses.filter((s) => s.checked);

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
    state.events,
    state.statuses,
    duplicateRepeatedEvent,
    agendas,
    labels,
    getAgendaByEvent,
  ]);

  const setEvents = useCallback((events) => {
    setState((v) => ({
      ...v,
      events,
    }));
  }, []);

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

      const currEvents = state.events;
      currEvents.push(newEvent);

      setState((v) => ({
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
      const currEvents = state.events.map((e) => {
        if (e.id === event.id) e = { ...e, ...event };
        return e;
      });

      setState((v) => ({
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

      const currEvents = state.events.filter((e) => e.id !== event.id);

      setState((v) => ({
        ...v,
        events: currEvents,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  function deleteEventsByAgenda(agenda) {
    const currEvents = state.events.filter((e) => e.agendaId !== agenda.id);
    setState((v) => ({
      ...v,
      events: currEvents,
    }));
  }

  async function cancelEvent(event) {
    setIsLoading(true);
    try {
      await axios.put("/api/event/cancel", event);
      const currEvents = state.events.map((e) => {
        if (e.id === event.id) e = { ...e, ...event };
        return e;
      });

      setState((v) => ({
        ...v,
        events: currEvents,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  function openEventDialog(cell, event, agenda) {
    selectCell(cell);
    selectAgenda(agenda);
    setState((v) => ({
      ...v,
      eventDialog: true,
      event,
    }));
  }

  function closeEventDialog() {
    selectCell(null);
    selectAgenda(null);
    setState((v) => ({
      ...v,
      eventDialog: false,
      event: null,
    }));
  }

  function toggleEventStatuses(status, checked) {
    const currStatuses = state.statuses.map((s) => {
      if (s.value === status.value) {
        s.checked = checked;
      }

      return s;
    });

    setState((v) => ({ ...v, statuses: currStatuses }));
  }

  return {
    ...state,
    getEvents,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteEventsByAgenda,
    cancelEvent,
    openEventDialog,
    closeEventDialog,
    toggleEventStatuses,
  };
};

export default useEvent;
