import axios from "axios";
import { add, sub } from "date-fns";
import usePrevious from "hooks/usePrevious";
import { createContext, useContext, useEffect, useState } from "react";
import { Views } from "react-big-calendar";

const projectContext = {
  ready: false,
  loadingProject: false,
  projectDialog: false,
  isEditingProject: false,
  projects: [],
  project: null,
  labels: [],
  loadingAgenda: false,
  agendaDialog: false,
  isEditingAgenda: false,
  agendas: [],
  agenda: {
    start: sub(new Date(), { months: 1 }),
    end: add(new Date(), { months: 1 }),
  },
  loadingEvent: false,
  events: [],
  eventIds: [],
  event: null,
  statuses: [
    { title: "To Do", value: "TODO", checked: true },
    { title: "In Progress", value: "INPROGRESS", checked: true },
    { title: "Completed", value: "COMPLETED", checked: true },
  ],
  view: Views.MONTH,
  isTable: false,
  selectedDate: new Date(),
  selectedCell: null,
};

const ProjectContext = createContext(projectContext);

const useContextController = (initialContext) => {
  const [ctx, setContext] = useState(initialContext);

  useEffect(() => {
    let persistCtx = localStorage.getItem("ctx");
    if (persistCtx) {
      persistCtx = JSON.parse(persistCtx);
      let { agendas, agenda, events, eventIds, event } = persistCtx;
      if (agendas?.length) {
        agendas = agendas.map((a) => ({
          ...a,
          start: new Date(a.start),
          ...(a.end && { end: new Date(a.end) }),
        }));
      }

      if (agenda) {
        agenda.start = new Date(agenda.start);
        if (agenda.end) agenda.end = new Date(agenda.end);
      }

      if (events?.length) {
        events = events.map((a) => ({
          ...a,
          start: new Date(a.start),
          ...(a.end && { end: new Date(a.end) }),
        }));
      }

      if (eventIds?.length) {
        eventIds = eventIds.map((a) => ({
          ...a,
          start: new Date(a.start),
          ...(a.end && { end: new Date(a.end) }),
        }));
      }

      if (event) {
        event.start = new Date(event.start);
        if (event.end) event.end = new Date(event.end);
      }

      persistCtx.agendas = agendas;
      persistCtx.agenda = agenda;
      persistCtx.events = events;
      persistCtx.eventIds = eventIds;
      persistCtx.event = event;
      persistCtx.selectedDate = new Date();

      setContext(persistCtx);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ctx", JSON.stringify(ctx));
  }, [ctx]);

  function setSelectedDate(selectedDate) {
    setContext((v) => ({ ...v, selectedDate }));
  }

  function setSelectedCell(selectedCell) {
    setContext((v) => ({ ...v, selectedCell }));
  }

  function setView(view) {
    return function () {
      setContext((v) => ({ ...v, view }));
    };
  }

  function toggleIsTable() {
    setContext((v) => ({ ...v, isTable: !v.isTable }));
  }

  function toggleProjectDialog() {
    setContext((v) => ({ ...v, projectDialog: !v.projectDialog }));
  }

  function setIsEditingProject(val) {
    setContext((v) => ({ ...v, isEditingProject: val }));
  }

  async function selectProject(project, isChangeProject = true) {
    try {
      setContext((v) => ({
        ...v,
        loadingProject: true,
      }));

      const res = await axios.get(`/api/project/get?projectId=${project.id}`);
      const selectedProject = res.data?.project;

      setContext((v) => ({
        ...v,
        project: selectedProject,
        labels: selectedProject.labels.map((l) => ({ ...l, checked: true })),
        agenda: isChangeProject ? null : v.agenda,
        loadingProject: false,
      }));
    } catch (err) {
      console.error(err);
      setContext((v) => ({
        ...v,
        loadingProject: false,
      }));
    }
  }

  async function addProject(project) {
    try {
      setContext((v) => ({
        ...v,
        loadingProject: true,
      }));

      const res = await axios.post("/api/project/create", project);
      const projectId = res.data?.project;
      const newProject = {
        id: projectId,
        ...project,
      };

      setContext((v) => ({
        ...v,
        projects: [...v.projects, newProject],
        loadingProject: false,
      }));

      await selectProject(newProject);
    } catch (err) {
      console.error(err);
      setContext((v) => ({
        ...v,
        loadingProject: false,
      }));
    }
  }

  async function updateProject(project) {
    try {
      setContext((v) => ({
        ...v,
        loadingProject: true,
      }));

      await axios.put("/api/project/update", project);
      const currProjects = ctx.projects;
      currProjects.forEach((p) => {
        if (p.id === project.id) p = project;
      });
      setContext((v) => ({
        ...v,
        projects: currProjects,
        loadingProject: false,
      }));

      await selectProject(project, false);
    } catch (err) {
      console.error(err);
      setContext((v) => ({
        ...v,
        loadingProject: false,
      }));
    }
  }

  function toggleProjectLabels(label, checked) {
    const currLabels = ctx.labels.map((l) => {
      if (l.id === label.id) {
        l.checked = checked;
      }

      return l;
    });

    setContext((v) => ({ ...v, labels: currLabels }));
  }

  function toggleAgendaDialog() {
    setContext((v) => ({ ...v, agendaDialog: !v.agendaDialog }));
  }

  function setIsEditingAgenda(val) {
    setContext((v) => ({ ...v, isEditingAgenda: val }));
  }

  async function selectAgenda(agenda, isChangeAgenda = true) {
    try {
      setContext((v) => ({
        ...v,
        loadingAgenda: true,
      }));

      const res = await axios.get(`/api/agenda/get?agendaId=${agenda.id}`);
      const selectedAgenda = res.data?.agenda;

      setContext((v) => ({
        ...v,
        agenda: selectedAgenda,
        events: isChangeAgenda ? [] : v.events,
        eventIds: isChangeAgenda ? [] : v.eventIds,
        event: isChangeAgenda ? [] : v.event,
        loadingAgenda: false,
      }));
    } catch (err) {
      console.error(err);
      setContext((v) => ({
        ...v,
        loadingAgenda: false,
      }));
    }
  }

  async function addAgenda(agenda) {
    if (ctx.project?.id)
      try {
        setContext((v) => ({
          ...v,
          loadingAgenda: true,
        }));

        const res = await axios.post("/api/agenda/create", {
          ...agenda,
          projectId: ctx.project.id,
        });

        const agendaId = res.data?.agenda;
        const newAgenda = {
          id: agendaId,
          ...agenda,
        };

        setContext((v) => ({
          ...v,
          agendas: [...v.agendas, newAgenda],
          loadingAgenda: false,
        }));

        await selectAgenda(newAgenda);
      } catch (err) {
        console.error(err);
        setContext((v) => ({
          ...v,
          loadingAgenda: false,
        }));
      }
  }

  async function updateAgenda(agenda) {
    try {
      setContext((v) => ({
        ...v,
        loadingAgenda: true,
      }));

      await axios.put("/api/agenda/update", agenda);
      const currAgendas = ctx.agendas;
      currAgendas.forEach((p) => {
        if (p.id === agenda.id) p = agenda;
      });

      setContext((v) => ({
        ...v,
        agendas: currAgendas,
        loadingAgenda: false,
      }));

      await selectAgenda(agenda, false);
    } catch (err) {
      console.error(err);
      setContext((v) => ({
        ...v,
        loadingAgenda: false,
      }));
    }
  }

  async function addEvent(event) {
    if (ctx.agenda?.id)
      try {
        const res = await axios.post("/api/event/create", {
          ...event,
          agendaId: ctx.agenda.id,
        });

        const eventId = res.data?.event;
        const newEvent = {
          id: eventId,
          ...event,
        };

        setContext((v) => ({
          ...v,
          events: [...v.events, newEvent],
          eventIds: [...v.eventIds, newEvent],
          event: newEvent,
        }));
      } catch (err) {
        console.error(err);
      }
  }

  function selectEvent(event) {
    setContext((v) => ({
      ...v,
      event,
    }));
  }

  function toggleEventStatuses(status, checked) {
    const currStatuses = ctx.statuses.map((l) => {
      if (l.value === status.value) {
        l.checked = checked;
      }

      return l;
    });

    setContext((v) => ({ ...v, statuses: currStatuses }));
  }

  useEffect(() => {
    (async () => {
      setContext((v) => ({
        ...v,
        loadingProject: true,
      }));

      try {
        const res = await axios.get("/api/project/list");
        const projects = res.data?.projects;
        setContext((v) => ({
          ...v,
          projects,
          loadingProject: false,
        }));
      } catch (err) {
        console.error(err);
        setContext((v) => ({
          ...v,
          loadingProject: false,
        }));
      }
    })();
  }, []);

  const prevProjectId = usePrevious(ctx.project?.id);

  useEffect(() => {
    if (ctx.project?.id !== prevProjectId)
      (async () => {
        setContext((v) => ({
          ...v,
          loadingAgenda: true,
        }));

        try {
          const res = await axios.get(
            `/api/agenda/list?projectId=${ctx.project.id}`
          );
          const agendas = res.data?.agendas.map((a) => ({
            ...a,
            start: new Date(a.start),
            ...(a.end && { end: new Date(a.end) }),
          }));
          setContext((v) => ({
            ...v,
            agendas,
            loadingAgenda: false,
          }));
        } catch (err) {
          console.error(err);
          setContext((v) => ({
            ...v,
            loadingAgenda: false,
          }));
        }
      })();
  }, [ctx.project?.id, prevProjectId]);

  const prevAgendaId = usePrevious(ctx.agenda?.id);

  useEffect(() => {
    if (ctx.agenda?.id !== prevAgendaId)
      (async () => {
        setContext((v) => ({
          ...v,
          loadingEvent: true,
        }));

        try {
          const res = await axios.get(
            `/api/event/list?agendaId=${ctx.agenda.id}`
          );
          const events = res.data?.events?.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }));
          setContext((v) => ({
            ...v,
            events,
            eventIds: events,
            loadingEvent: false,
          }));
        } catch (err) {
          console.error(err);
          setContext((v) => ({
            ...v,
            loadingEvent: false,
          }));
        }
      })();
  }, [ctx.agenda?.id, prevAgendaId]);

  useEffect(() => {
    const checkedLabels = ctx.labels.filter((l) => l.checked);
    const checkedStatuses = ctx.statuses.filter((l) => l.checked);
    const currEvents = ctx.eventIds
      .filter(
        (e) =>
          !e.labels.length ||
          checkedLabels.find((l) => e.labels.find((el) => el.id === l.id))
      )
      .filter((e) => checkedStatuses.find((l) => e.status === l.value));
    setContext((v) => ({ ...v, events: currEvents }));
  }, [ctx.labels, ctx.statuses, ctx.eventIds]);

  return {
    ...ctx,
    setContext,
    setSelectedDate,
    setSelectedCell,
    setView,
    toggleIsTable,
    toggleProjectDialog,
    setIsEditingProject,
    addProject,
    updateProject,
    selectProject,
    toggleProjectLabels,
    toggleAgendaDialog,
    setIsEditingAgenda,
    addAgenda,
    updateAgenda,
    selectAgenda,
    addEvent,
    selectEvent,
    toggleEventStatuses,
  };
};

export default function ProjectContextProvider({
  children,
  context: initialContext = projectContext,
}) {
  const controlledContext = useContextController(initialContext);
  return (
    <ProjectContext.Provider value={controlledContext}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjectContext = () => useContext(ProjectContext);
