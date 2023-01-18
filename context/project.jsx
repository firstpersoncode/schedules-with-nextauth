import axios from "axios";
import { add, sub } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";
import { Views } from "react-big-calendar";

const projectContext = {
  ready: false,
  loadingProject: false,
  dialogNewProject: false,
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

  function toggleDialogNewProject() {
    setContext((v) => ({ ...v, dialogNewProject: !v.dialogNewProject }));
  }

  async function addProject(project) {
    try {
      const res = await axios.post("/api/project/create", project);
      const newProject = res.data?.project;
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

  async function selectProject(project) {
    setContext((v) => ({
      ...v,
      project,
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
        const newAgenda = res.data?.agenda;
        newAgenda.start = new Date(newAgenda.start);
        if (newAgenda.end) newAgenda.end = new Date(newAgenda.end);
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
        const newEvent = res.data?.event;
        newEvent.start = new Date(newEvent.start);
        newEvent.end = new Date(newEvent.end);
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

  useEffect(() => {
    if (ctx.project?.id)
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
  }, [ctx.project]);

  useEffect(() => {
    if (ctx.agenda?.id)
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
  }, [ctx.agenda]);

  return {
    ...ctx,
    setContext,
    setSelectedDate,
    setSelectedCell,
    setView,
    toggleIsTable,
    toggleDialogNewProject,
    addProject,
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
