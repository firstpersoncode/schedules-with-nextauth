import {
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  LinearProgress,
  List,
  ListItem,
  IconButton,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useProjectContext } from "context/project";
import { Add, Delete } from "@mui/icons-material";

export default function ProjectDialog() {
  const {
    setIsEditingProject,
    isEditingProject,
    project,
    projectDialog,
    toggleProjectDialog,
    addProject,
    updateProject,
    deleteProject,
  } = useProjectContext();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    labels: [],
  });

  const open = projectDialog;

  useEffect(() => {
    if (isEditingProject && project?.id) {
      setState({
        title: project.title,
        description: project.description,
        labels: project.labels,
      });
    }
  }, [isEditingProject, project]);

  function onClose() {
    if (loading) return;
    toggleProjectDialog();
    setIsEditingProject(false);
    setErrors({});
    setState({
      title: "",
      description: "",
      labels: [],
    });
  }

  function addLabel() {
    setState((v) => ({ ...v, labels: [...v.labels, { title: "" }] }));
  }

  function deleteLabel(i) {
    return function () {
      const labels = state.labels;
      labels.splice(i, 1);
      setState((v) => ({ ...v, labels }));
    };
  }

  function handleChangeLabel(i) {
    return function (e) {
      const labels = state.labels;
      const selectedLabel = labels[i];
      selectedLabel.title = e.target.value;
      labels[i] = selectedLabel;
      setState((v) => ({ ...v, labels }));
    };
  }

  function handleChange(name) {
    return function (e) {
      const value = e.target.value;
      setState((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
      setErrors((v) => ({ ...v, [name]: undefined }));
    };
  }

  function validateForm() {
    let errors = {};
    if (!state.title) errors.title = "Required";

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();

    try {
      await deleteProject(project);
      onClose();
    } catch (err) {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

    try {
      if (isEditingProject) {
        await updateProject({
          id: project.id,
          title: state.title,
          description: state.description,
          labels: state.labels,
        });
      } else {
        await addProject({
          title: state.title,
          description: state.description,
          labels: state.labels,
        });
      }

      onClose();
    } catch (err) {}
    setLoading(false);
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      {isEditingProject && (
        <DialogActions>
          <IconButton disabled={loading} onClick={handleDelete}>
            <Delete />
          </IconButton>
        </DialogActions>
      )}

      <Box>
        {loading && <LinearProgress />}
        <Box sx={{ p: 2 }}>
          <TextField
            required
            sx={{ mb: 2 }}
            label="Title"
            value={state.title}
            onChange={handleChange("title")}
            error={errors.title}
            helperText={errors.title}
            fullWidth
          />
          <TextField
            label="Description"
            sx={{ mb: 2 }}
            value={state.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            minRows={4}
          />

          <Divider>Labels</Divider>

          <List sx={{ maxWidth: 400 }}>
            {state.labels.map((label, i) => (
              <ListItem
                key={i}
                sx={{ pl: 0 }}
                secondaryAction={
                  <IconButton edge="end" onClick={deleteLabel(i)}>
                    <Delete />
                  </IconButton>
                }
              >
                <TextField
                  label="Label"
                  sx={{ mb: 2 }}
                  value={label.title}
                  onChange={handleChangeLabel(i)}
                  fullWidth
                />
              </ListItem>
            ))}

            <Button onClick={addLabel} variant="contained" startIcon={<Add />}>
              Label
            </Button>
          </List>
        </Box>
      </Box>

      <DialogActions>
        <Button disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={handleSubmit}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
