import { useCallback, useState } from "react";
import axios from "axios";

const initialState = {
  agendas: [],
  agenda: null,
  agendaDialog: false,
  labels: [],
};

const useAgenda = ({ setIsLoading }) => {
  const [state, setState] = useState(initialState);

  const getAgendaByEvent = useCallback(
    (event) => {
      if (!event) return;
      const selectedAgenda = state.agendas.find((a) => a.id === event.agendaId);
      return selectedAgenda;
    },
    [state.agendas]
  );

  const setAgendas = useCallback((agendas) => {
    setState((v) => ({
      ...v,
      agendas,
    }));
  }, []);

  const selectAgenda = useCallback((agenda) => {
    setState((v) => ({
      ...v,
      agenda,
    }));
  }, []);

  function toggleCheckedAgenda(agenda, checked) {
    const currAgendas = state.agendas.map((a) => {
      if (a.id === agenda.id) {
        a.checked = checked;
      }

      return a;
    });

    setState((v) => ({ ...v, agendas: currAgendas }));
  }

  async function addAgenda(agenda) {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/agenda/create", agenda);
      const newAgenda = res.data?.agenda;
      newAgenda.start = new Date(newAgenda.start);
      newAgenda.end = new Date(newAgenda.end);
      newAgenda.checked = true;

      const currAgendas = state.agendas;
      currAgendas.push(newAgenda);
      const labels = state.labels;
      labels.push(...newAgenda.labels.map((l) => ({ ...l, checked: true })));

      setState((v) => ({
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

      const currAgendas = state.agendas.map((e) => {
        if (e.id === updatedAgenda.id) e = { ...e, ...updatedAgenda };
        return e;
      });

      const labels = state.labels.map((l) => {
        const updatedLabel = updatedAgenda.labels.find((el) => el.id === l.id);
        if (updatedLabel) l = { ...l, ...updatedLabel, checked: true };
        return l;
      });

      const newLabels = updatedAgenda.labels.filter(
        (l) => !Boolean(labels.find((el) => el.id === l.id))
      );

      if (newLabels.length)
        labels.push(...newLabels.map((l) => ({ ...l, checked: true })));

      setState((v) => ({
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

      const currAgendas = state.agendas.filter((e) => e.id !== agenda.id);
      const currLabels = state.labels.filter((e) => e.agendaId !== agenda.id);

      setState((v) => ({
        ...v,
        agendas: currAgendas,
        labels: currLabels,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  function openAgendaDialog(agenda) {
    setState((v) => ({
      ...v,
      agendaDialog: true,
      agenda,
    }));
  }

  function closeAgendaDialog() {
    setState((v) => ({
      ...v,
      agendaDialog: false,
      agenda: null,
    }));
  }

  const getLabelsByAgenda = useCallback(
    (agenda) => state.labels.filter((l) => l.agendaId === agenda.id),
    [state.labels]
  );

  const setLabels = useCallback((labels) => {
    setState((v) => ({
      ...v,
      labels,
    }));
  }, []);

  function toggleCheckedLabel(label, checked) {
    const currLabels = state.labels.map((l) => {
      if (l.id === label.id) {
        l.checked = checked;
      }

      return l;
    });

    setState((v) => ({ ...v, labels: currLabels }));
  }

  return {
    ...state,
    getAgendaByEvent,
    setAgendas,
    selectAgenda,
    toggleCheckedAgenda,
    addAgenda,
    updateAgenda,
    deleteAgenda,
    openAgendaDialog,
    closeAgendaDialog,
    getLabelsByAgenda,
    setLabels,
    toggleCheckedLabel,
  };
};

export default useAgenda;
