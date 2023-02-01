import { useCallback, useState } from "react";
import axios from "axios";
import { add, differenceInMinutes, isAfter, isBefore } from "date-fns";
import { useCommonContext } from "context/common";

export const repeats = { DAILY: "days", WEEKLY: "weeks", MONTHLY: "months" };
export const repeatOptions = [
  { title: "Daily", value: "DAILY" },
  { title: "Weekly", value: "WEEKLY" },
  { title: "Monthly", value: "MONTHLY" },
];

// const statuses = [
//   { title: "To Do", value: "TODO", checked: true },
//   { title: "In Progress", value: "INPROGRESS", checked: true },
//   { title: "Completed", value: "COMPLETED", checked: true },
// ];

const initialState = {
  slot: null,
  events: [],
  event: null,
  // statuses,
};

const useEvent = ({
  selectAgenda,
  getAgendaByEvent,
  agendas,
  labels,
  statuses,
}) => {
  const {
    setIsLoading,
    openEventDialog: openEvent,
    closeEventDialog: closeEvent,
  } = useCommonContext();

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
    const checkedStatuses = statuses.filter((s) => s.checked);

    let res = events
      .filter((e) => checkedAgendas.find((a) => a.id === e.agendaId))
      .filter((e) => {
        if (!e.labels.length)
          return checkedLabels.find((l) => !l.id && l.agendaId === e.agendaId);
        return checkedLabels.find((l) => e.labels.find((el) => el.id === l.id));
      })
      .filter(
        (e) => e.status && checkedStatuses.find((s) => s.id === e.status.id)
      );

    res.forEach((event) => {
      if (event.repeat) {
        res = res.filter((e) => e.id !== event.id);
        const agenda = getAgendaByEvent(event);
        const duplicates = duplicateRepeatedEvent(agenda.end, event);
        res = [...res, ...duplicates];
      }
    });

    return res;
  }, [
    state.events,
    duplicateRepeatedEvent,
    statuses,
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

  async function addEvent({ agenda, status, ...event }) {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/event/create", {
        ...event,
        agendaId: agenda.id,
        statusId: status.id,
      });

      const newEventId = res.data?.event;
      const newEvent = {
        id: newEventId,
        agendaId: agenda.id,
        status,
        ...event,
      };

      const currEvents = [...state.events];
      currEvents.push(newEvent);

      setState((v) => ({
        ...v,
        events: currEvents,
        event: newEvent,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  async function updateEvent({ status, ...event }) {
    setIsLoading(true);
    try {
      await axios.put("/api/event/update", { ...event, statusId: status.id });
      const currEvents = state.events.map((e) => {
        if (e.id === event.id) e = { ...e, ...event, status };
        return e;
      });

      setState((v) => ({
        ...v,
        events: currEvents,
        event: { ...state.event, ...event, status },
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

  function openEventDialog(slot, event, agenda) {
    selectAgenda(agenda);
    setState((v) => ({
      ...v,
      event,
      slot,
    }));
    openEvent();
  }

  function closeEventDialog() {
    selectAgenda(null);
    setState((v) => ({
      ...v,
      event: null,
      slot: null,
    }));
    closeEvent();
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
  };
};

export default useEvent;
