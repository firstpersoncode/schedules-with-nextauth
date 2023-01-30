import { useCallback, useState } from "react";
import axios from "axios";
import { useCommonContext } from "context/common";

const initialState = {
  agendas: [],
  agenda: null,
  labels: [],
  statuses: [],
};

const useAgenda = () => {
  const {
    setIsLoading,
    openAgendaDialog: openAgenda,
    closeAgendaDialog: closeAgenda,
  } = useCommonContext();
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
      labels.push({
        title: "No label",
        color: "#CCC",
        agendaId: newAgenda.id,
        checked: true,
      });
      labels.push(...newAgenda.labels.map((l) => ({ ...l, checked: true })));
      const statuses = state.statuses;
      statuses.push(
        ...newAgenda.statuses.map((s) => ({ ...s, checked: true }))
      );

      setState((v) => ({
        ...v,
        agendas: currAgendas,
        labels,
        statuses,
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

      let labels = state.labels.map((l) => {
        const updatedLabel = updatedAgenda.labels.find((el) => el.id === l.id);
        if (updatedLabel) l = { ...l, ...updatedLabel, checked: true };
        return l;
      });

      const newLabels = updatedAgenda.labels.filter(
        (l) => !Boolean(labels.find((el) => el.id === l.id))
      );

      if (newLabels.length)
        labels.push(...newLabels.map((l) => ({ ...l, checked: true })));

      const deletedLabels = labels
        .filter((label) => label.agendaId === updatedAgenda.id)
        .filter(
          (label) =>
            label.id && !updatedAgenda.labels.find((l) => l.id === label.id)
        );

      if (deletedLabels.length)
        labels = labels.filter(
          (label) => !deletedLabels.find((l) => l.id === label.id)
        );

      let statuses = state.statuses.map((status) => {
        const updatedStatus = updatedAgenda.statuses.find(
          (s) => s.id === status.id
        );
        if (updatedStatus)
          status = { ...status, ...updatedStatus, checked: true };
        return status;
      });

      const newStatuses = updatedAgenda.statuses.filter(
        (status) => !Boolean(statuses.find((s) => s.id === status.id))
      );

      if (newStatuses.length)
        statuses.push(...newStatuses.map((s) => ({ ...s, checked: true })));

      const deletedStatuses = statuses
        .filter((status) => status.agendaId === updatedAgenda.id)
        .filter(
          (status) => !updatedAgenda.statuses.find((s) => s.id === status.id)
        );

      if (deletedStatuses.length)
        statuses = statuses.filter(
          (status) => !deletedStatuses.find((s) => s.id === status.id)
        );

      setState((v) => ({
        ...v,
        agendas: currAgendas,
        labels,
        statuses,
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
      const currStatuses = state.statuses.filter(
        (e) => e.agendaId !== agenda.id
      );

      setState((v) => ({
        ...v,
        agendas: currAgendas,
        labels: currLabels,
        statuses: currStatuses,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  function openAgendaDialog(agenda) {
    setState((v) => ({
      ...v,
      agenda,
    }));

    openAgenda();
  }

  function closeAgendaDialog() {
    setState((v) => ({
      ...v,
      agenda: null,
    }));

    closeAgenda();
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

  function toggleCheckedLabel(label, checked, agenda) {
    const currLabels = state.labels.map((l) => {
      if (agenda.id === l.agendaId && l.id === label.id) {
        l.checked = checked;
      }

      return l;
    });

    setState((v) => ({ ...v, labels: currLabels }));
  }

  const getStatusesByAgenda = useCallback(
    (agenda) =>
      state.statuses.filter((s) => agenda?.id && s.agendaId === agenda.id),
    [state.statuses]
  );

  const setStatuses = useCallback((statuses) => {
    setState((v) => ({
      ...v,
      statuses,
    }));
  }, []);

  function toggleCheckedStatus(status, checked, agenda) {
    const currLabels = state.statuses.map((s) => {
      if (agenda.id === s.agendaId && s.id === status.id) {
        s.checked = checked;
      }

      return s;
    });

    setState((v) => ({ ...v, statuses: currLabels }));
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
    getStatusesByAgenda,
    setStatuses,
    toggleCheckedStatus,
  };
};

export default useAgenda;
