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
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import { useState } from "react";
import { useProjectContext } from "context/project";
import { Add, Delete } from "@mui/icons-material";

export default function AddProject() {
  const { dialogNewProject, toggleDialogNewProject, addProject } =
    useProjectContext();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    labels: [],
  });

  const open = dialogNewProject;

  function onClose() {
    if (loading) return;
    setErrors({});
    toggleDialogNewProject();
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

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

    try {
      await addProject({
        title: state.title,
        description: state.description,
        labels: state.labels,
      });

      onClose();
      setState({
        title: "",
        description: "",
        labels: [],
      });
    } catch (err) {}
    setLoading(false);
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
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
                secondaryAction={
                  <IconButton edge="end" onClick={deleteLabel(i)}>
                    <Delete />
                  </IconButton>
                }
              >
                {/* <ListItemText primary={label.title} /> */}
                <TextField
                  label="Label"
                  sx={{ mb: 2 }}
                  value={label.title}
                  onChange={handleChangeLabel(i)}
                  fullWidth
                />
              </ListItem>
            ))}

            <ListItemButton onClick={addLabel}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end">
                    <Add />
                  </IconButton>
                }
              >
                <ListItemText secondary="Add Label" />
              </ListItem>
            </ListItemButton>
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
