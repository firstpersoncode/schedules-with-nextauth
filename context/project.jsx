import axios from "axios";
import { add, sub } from "date-fns";
import usePrevious from "hooks/usePrevious";
import { createContext, useContext, useEffect, useState } from "react";
import { Views } from "react-big-calendar";

const projectContext = {
  ready: false,
  loadingProject: false,
  projectDialog: false,
  projects: [],
  project: null,
  labels: [],
  loadingAgenda: false,
  dialogNewAgenda: false,
  agendas: [],
  agenda: {
    start: sub(new Date(), { months: 1 }),
    end: add(new Date(), { months: 1 }),
  },
  loadingEvent: false,
  events: [],
  event: null,
  view: Views.MONTH,
  isTable: false,
  selectedDate: new Date(),
  selectedCell: null,
};

const ProjectContext = createContext(projectContext);

const useContextController = (initialContext) => {
  const [ctx, setContext] = useState(initialContext);

  // useEffect(() => {
  //   let persistCtx = localStorage.getItem("ctx");
  //   if (persistCtx) persistCtx = JSON.parse(persistCtx);
  //   let { agendas, agenda, events, event } = persistCtx;
  //   if (agendas?.length) {
  //     agendas = agendas.map((a) => ({
  //       ...a,
  //       start: new Date(a.start),
  //       ...(a.end && { end: new Date(a.end) }),
  //     }));
  //   }

  //   if (agenda) {
  //     agenda.start = new Date(agenda.start);
  //     if (agenda.end) agenda.end = new Date(agenda.end);
  //   }

  //   if (events?.length) {
  //     events = events.map((a) => ({
  //       ...a,
  //       start: new Date(a.start),
  //       ...(a.end && { end: new Date(a.end) }),
  //     }));
  //   }

  //   if (event) {
  //     event.start = new Date(event.start);
  //     if (event.end) event.end = new Date(event.end);
  //   }

  //   persistCtx.agendas = agendas;
  //   persistCtx.agenda = agenda;
  //   persistCtx.events = events;
  //   persistCtx.event = event;
  //   persistCtx.selectedDate = new Date();

  //   setContext(persistCtx);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("ctx", JSON.stringify(ctx));
  // }, [ctx]);

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

  async function addProject(project) {
    try {
      const res = await axios.post("/api/project/create", project);
      const projectId = res.data?.project;
      const newProject = {
        id: projectId,
        ...project,
      };

      setContext((v) => ({
        ...v,
        projects: [...v.projects, newProject],
        project: newProject,
        labels: newProject.labels,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function updateProject(project) {
    try {
      await axios.put("/api/project/update", project);
      const currProjects = ctx.projects;
      currProjects.forEach((p) => {
        if (p.id === project.id) p = project;
      });
      setContext((v) => ({
        ...v,
        projects: currProjects,
        project,
        labels: project.labels,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function selectProject(project) {
    setContext((v) => ({
      ...v,
      project,
      agenda: null,
      labels: project.labels,
    }));
  }

  function toggleDialogNewAgenda() {
    setContext((v) => ({ ...v, dialogNewAgenda: !v.dialogNewAgenda }));
  }

  async function addAgenda(agenda) {
    if (ctx.project?.id)
      try {
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
          agenda: newAgenda,
        }));
      } catch (err) {
        console.error(err);
      }
  }

  function selectAgenda(agenda) {
    setContext((v) => ({
      ...v,
      agenda,
    }));
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
          agendas: [],
          agenda: null,
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
          events: [],
          event: null,
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

  return {
    ...ctx,
    setContext,
    setSelectedDate,
    setSelectedCell,
    setView,
    toggleIsTable,
    toggleProjectDialog,
    addProject,
    updateProject,
    selectProject,
    toggleDialogNewAgenda,
    addAgenda,
    selectAgenda,
    addEvent,
    selectEvent,
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
