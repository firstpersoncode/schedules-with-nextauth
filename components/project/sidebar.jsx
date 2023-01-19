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
  LinearProgress,
  IconButton,
} from "@mui/material";
import { useProjectContext } from "context/project";

function Menu() {
  const {
    projects,
    project,
    selectProject,
    toggleProjectDialog,
    toggleProjectLabels,
    setIsEditingProject,
    labels,
    statuses,
    toggleEventStatuses,
    agenda,
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
      <Box sx={{ overflowY: "auto" }}>
        {loadingProject && <LinearProgress />}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
          <Autocomplete
            sx={{ flex: 1 }}
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
              <TextField {...params} label="Project" variant="outlined" />
            )}
          />

          <IconButton onClick={toggleProjectDialog} size="small">
            <Add />
          </IconButton>

          {project?.id && (
            <IconButton onClick={handleClickEditProject} size="small">
              <Edit />
            </IconButton>
          )}
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

export default function SideBar({ open, onClose, onOpen }) {
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
        <Menu />
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
        <Menu />
      </Drawer>
    </>
  );
}
