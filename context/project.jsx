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
  loadingAgenda: false,
  agendaDialog: false,
  isEditingAgenda: false,
  agendas: [],
  agenda: null,
  loadingEvent: false,
  eventDialog: false,
  isEditingEvent: false,
  events: [],
  eventIds: [],
  event: null,
  labels: [],
  statuses: [
    { title: "To Do", value: "TODO", checked: true },
    { title: "In Progress", value: "INPROGRESS", checked: true },
    { title: "Completed", value: "COMPLETED", checked: true },
  ],
  views: [
    { title: "Day", value: Views.DAY },
    { title: "Week", value: Views.WEEK },
    { title: "Month", value: Views.MONTH },
  ],
  view: { title: "Day", value: Views.DAY },
  isTable: false,
  isReport: false,
  selectedDate: new Date(),
  selectedCell: null,
};

const ProjectContext = createContext(projectContext);

const useContextController = (initialContext) => {
  const [ctx, setContext] = useState(initialContext);

  function setSelectedDate(selectedDate) {
    setContext((v) => ({ ...v, selectedDate }));
  }

  function setSelectedCell(selectedCell) {
    setContext((v) => ({ ...v, selectedCell }));
  }

  function selectView(view) {
    setContext((v) => ({ ...v, view }));
  }

  function toggleIsTable() {
    setContext((v) => ({ ...v, isTable: !v.isTable }));
  }

  function toggleReport() {
    setContext((v) => ({ ...v, isReport: !v.isReport }));
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

      const currProjects = ctx.projects;
      currProjects.push(newProject);

      setContext((v) => ({
        ...v,
        projects: currProjects,
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
      const currProjects = ctx.projects.map((e) => {
        if (e.id === project.id) e = { ...e, ...project };
        return e;
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

  async function deleteProject(project) {
    try {
      setContext((v) => ({
        ...v,
        loadingProject: true,
      }));

      await axios.delete(`/api/project/delete?projectId=${project.id}`);

      const currProjects = ctx.projects.filter((e) => e.id !== project.id);

      setContext((v) => ({
        ...v,
        projects: currProjects,
        project: null,
        agendas: [],
        agenda: null,
        events: [],
        eventIds: [],
        event: null,
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
        const currAgendas = ctx.agendas;
        currAgendas.push(newAgenda);

        setContext((v) => ({
          ...v,
          agendas: currAgendas,
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
      const currAgendas = ctx.agendas.map((e) => {
        if (e.id === agenda.id) e = { ...e, ...agenda };
        return e;
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

  async function deleteAgenda(agenda) {
    try {
      setContext((v) => ({
        ...v,
        loadingAgenda: true,
      }));

      await axios.delete(`/api/agenda/delete?agendaId=${agenda.id}`);

      const currAgendas = ctx.agendas.filter((e) => e.id !== agenda.id);

      setContext((v) => ({
        ...v,
        agendas: currAgendas,
        agenda: null,
        events: [],
        eventIds: [],
        event: null,
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

  function toggleEventDialog() {
    setContext((v) => ({ ...v, eventDialog: !v.eventDialog }));
  }

  function setIsEditingEvent(val) {
    setContext((v) => ({ ...v, isEditingEvent: val }));
  }

  function selectEvent(event) {
    setContext((v) => ({
      ...v,
      event,
    }));
  }

  async function addEvent(event) {
    if (ctx.agenda?.id)
      try {
        setContext((v) => ({
          ...v,
          loadingEvent: true,
        }));

        const res = await axios.post("/api/event/create", {
          ...event,
          agendaId: ctx.agenda.id,
        });

        const eventId = res.data?.event;
        const newEvent = {
          id: eventId,
          ...event,
        };

        const currEvents = ctx.events;
        currEvents.push(newEvent);

        const currEventIds = ctx.eventIds;
        currEventIds.push(newEvent);

        setContext((v) => ({
          ...v,
          events: currEvents,
          eventIds: currEventIds,
          loadingEvent: false,
        }));
      } catch (err) {
        console.error(err);
        setContext((v) => ({
          ...v,
          loadingAgenda: false,
        }));
      }
  }

  async function updateEvent(event) {
    try {
      setContext((v) => ({
        ...v,
        loadingEvent: true,
      }));

      await axios.put("/api/event/update", event);
      const currEvents = ctx.events.map((e) => {
        if (e.id === event.id) e = { ...e, ...event };
        return e;
      });
      const currEventIds = ctx.eventIds.map((e) => {
        if (e.id === event.id) e = { ...e, ...event };
        return e;
      });

      setContext((v) => ({
        ...v,
        events: currEvents,
        eventIds: currEventIds,
        loadingEvent: false,
      }));

      await selectEvent(event, false);
    } catch (err) {
      console.error(err);
      setContext((v) => ({
        ...v,
        loadingEvent: false,
      }));
    }
  }

  async function deleteEvent(event) {
    try {
      setContext((v) => ({
        ...v,
        loadingEvent: true,
      }));

      await axios.delete(`/api/event/delete?eventId=${event.id}`);

      const currEvents = ctx.events.filter((e) => e.id !== event.id);

      setContext((v) => ({
        ...v,
        events: currEvents,
        eventIds: currEvents,
        event: null,
        loadingEvent: false,
      }));
    } catch (err) {
      console.error(err);
      setContext((v) => ({
        ...v,
        loadingEvent: false,
      }));
    }
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
    if (ctx.project?.id && ctx.project.id !== prevProjectId)
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
    if (ctx.agenda?.id && ctx.agenda.id !== prevAgendaId)
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

  useEffect(() => {
    let persistCtx = localStorage.getItem("ctx");
    if (persistCtx) {
      (async () => {
        setContext((v) => ({
          ...v,
          ready: false,
        }));

        persistCtx = JSON.parse(persistCtx);
        let { agenda, project, isTable, isReport, labels, statuses, view } =
          persistCtx;
        if (project) await selectProject(project);
        if (agenda) {
          agenda.start = new Date(agenda.start);
          if (agenda.end) agenda.end = new Date(agenda.end);
          await selectAgenda(agenda);
        }

        setContext((v) => ({
          ...v,
          isTable,
          isReport,
          labels,
          statuses,
          view,
          ready: true,
        }));
      })();
    } else {
      setContext((v) => ({
        ...v,
        ready: true,
      }));
    }
  }, []);

  useEffect(() => {
    const persistCtx = {
      project: ctx.project,
      agenda: ctx.agenda,
      labels: ctx.labels,
      statuses: ctx.statuses,
      view: ctx.view,
      isTable: ctx.isTable,
      isReport: ctx.isReport,
    };
    localStorage.setItem("ctx", JSON.stringify(persistCtx));
  }, [
    ctx.project,
    ctx.agenda,
    ctx.labels,
    ctx.statuses,
    ctx.view,
    ctx.isTable,
    ctx.isReport,
  ]);

  return {
    ...ctx,
    setContext,
    setSelectedDate,
    setSelectedCell,
    selectView,
    toggleIsTable,
    toggleReport,
    toggleProjectDialog,
    setIsEditingProject,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    toggleProjectLabels,
    toggleAgendaDialog,
    setIsEditingAgenda,
    addAgenda,
    updateAgenda,
    deleteAgenda,
    selectAgenda,
    toggleEventDialog,
    setIsEditingEvent,
    addEvent,
    updateEvent,
    deleteEvent,
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
