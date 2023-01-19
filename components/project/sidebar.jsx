import { Add, Edit } from "@mui/icons-material";
import {
  SwipeableDrawer,
  Box,
  Drawer,
  Divider,
  Toolbar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  TextField,
  Button,
  LinearProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useProjectContext } from "context/project";
import { useEffect } from "react";

function Menu() {
  const {
    events,
    loadingEvent,
    projects,
    project,
    selectProject,
    toggleProjectDialog,
    toggleProjectLabels,
    setIsEditingProject,
    labels,
    statuses,
    toggleEventStatuses,
    agendas,
    agenda,
    selectAgenda,
    toggleAgendaDialog,
    setIsEditingAgenda,
    loadingAgenda,
    loadingProject,
  } = useProjectContext();

  async function handleSelectProject(_, v) {
    const selectedProject = projects.find((p) => p.id === v.value);
    await selectProject(selectedProject);
  }

  function handleClickEditProject() {
    setIsEditingProject(true);
    toggleProjectDialog();
  }

  async function handleSelectAgenda(_, v) {
    const selectedAgenda = agendas.find((p) => p.id === v.value);
    await selectAgenda(selectedAgenda);
  }

  function handleClickEditAgenda() {
    setIsEditingAgenda(true);
    toggleAgendaDialog();
  }

  function handleCheckedLabel(label) {
    return function (_, checked) {
      toggleProjectLabels(label, checked);
    };
  }

  function handleCheckedStatus(status) {
    return function (_, checked) {
      toggleEventStatuses(status, checked);
    };
  }

  return (
    <>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ p: 2 }}>
          {loadingProject && <LinearProgress />}

          <Autocomplete
            options={projects.map((p) => ({ label: p.title, value: p.id }))}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              );
            }}
            disableClearable
            blurOnSelect
            value={project?.title || null}
            isOptionEqualToValue={(o, v) => o.label === v}
            onChange={handleSelectProject}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              disabled={!project?.id}
              onClick={handleClickEditProject}
              startIcon={<Edit />}
              fullWidth
              variant="contained"
              size="small"
            >
              Edit
            </Button>
            <Button
              onClick={toggleProjectDialog}
              startIcon={<Add />}
              fullWidth
              variant="contained"
              size="small"
            >
              Create
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {loadingAgenda && <LinearProgress />}

          <Autocomplete
            disabled={loadingAgenda || !project?.id}
            options={agendas.map((p, i) => ({ label: p.title, value: p.id }))}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              );
            }}
            disableClearable
            blurOnSelect
            value={agenda?.title || null}
            isOptionEqualToValue={(o, v) => o.label === v}
            onChange={handleSelectAgenda}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Agenda"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              disabled={!agenda?.id}
              onClick={handleClickEditAgenda}
              startIcon={<Edit />}
              fullWidth
              variant="contained"
              size="small"
            >
              Edit
            </Button>
            <Button
              disabled={!project?.id}
              onClick={toggleAgendaDialog}
              startIcon={<Add />}
              fullWidth
              variant="contained"
              size="small"
            >
              Create
            </Button>
          </Box>
        </Box>

        {project?.id && labels.length > 0 && (
          <>
            <Divider>Labels</Divider>
            <Box sx={{ p: 2 }}>
              <FormGroup>
                {labels.map((label, i) => (
                  <FormControlLabel
                    key={i}
                    onChange={handleCheckedLabel(label)}
                    control={<Checkbox checked={label.checked} />}
                    label={label.title}
                  />
                ))}
              </FormGroup>
            </Box>
          </>
        )}

        {agenda?.id && (
          <>
            <Divider>Statuses</Divider>
            <Box sx={{ p: 2 }}>
              <FormGroup>
                {statuses.map((status, i) => (
                  <FormControlLabel
                    key={i}
                    onChange={handleCheckedStatus(status)}
                    control={<Checkbox checked={status.checked} />}
                    label={status.title}
                  />
                ))}
              </FormGroup>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

const drawerWidth = "20vw";

export default function SideBar({ labels, open, onClose, onOpen }) {
  const { agenda } = useProjectContext();
  useEffect(() => {
    if (!agenda?.id) onOpen();
  }, [agenda, onOpen]);
  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        sx={{
          display: { xs: "block", lg: "none" },
          width: "90%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "90%",
            boxSizing: "border-box",
          },
        }}
      >
        <Menu labels={labels} />
      </SwipeableDrawer>

      <Drawer
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Menu labels={labels} />
      </Drawer>
    </>
  );
}
