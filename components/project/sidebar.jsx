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

function Menu() {
  const {
    projects,
    project,
    selectProject,
    toggleDialogNewProject,
    labels,
    agendas,
    agenda,
    selectAgenda,
    toggleDialogNewAgenda,
    loadingAgenda,
    loadingProject,
  } = useProjectContext();

  function handleSelectProject(_, v) {
    const selectedProject = projects.find((p) => p.id === v.value);
    selectProject(selectedProject);
  }

  function handleSelectAgenda(_, v) {
    const selectedAgenda = agendas.find((p) => p.id === v.value);
    selectAgenda(selectedAgenda);
  }

  return (
    <>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ p: 2 }}>
          {loadingProject && <LinearProgress />}

          <Autocomplete
            options={projects.map((p) => ({ label: p.title, value: p.id }))}
            disableClearable
            blurOnSelect
            value={project?.title || ""}
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
              onClick={toggleDialogNewProject}
              startIcon={<Edit />}
              fullWidth
              variant="contained"
              size="small"
              color="secondary"
            >
              Edit
            </Button>
            <Button
              onClick={toggleDialogNewProject}
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
            options={agendas.map((p) => ({ label: p.title, value: p.id }))}
            disableClearable
            blurOnSelect
            value={agenda?.title || ""}
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
              onClick={toggleDialogNewAgenda}
              startIcon={<Edit />}
              fullWidth
              variant="contained"
              size="small"
              color="secondary"
            >
              Edit
            </Button>
            <Button
              disabled={!project?.id}
              onClick={toggleDialogNewAgenda}
              startIcon={<Add />}
              fullWidth
              variant="contained"
              size="small"
            >
              Create
            </Button>
          </Box>
        </Box>

        {project?.id && labels.length && (
          <>
            <Divider>Labels</Divider>
            <Box sx={{ p: 2 }}>
              <FormGroup>
                {labels.map((label, i) => (
                  <FormControlLabel
                    key={i}
                    control={<Checkbox defaultChecked />}
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
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="To Do"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="In Progress"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Completed"
                />
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
