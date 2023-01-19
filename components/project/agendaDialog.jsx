import {
  Box,
  Button,
  Dialog as MuiDialog,
  DialogActions,
  TextField,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useProjectContext } from "context/project";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { isAfter } from "date-fns";
import { Delete } from "@mui/icons-material";
import Dialog, { useDialog } from "components/dialog";

export default function AgendaDialog() {
  const {
    setIsEditingAgenda,
    isEditingAgenda,
    agenda,
    agendaDialog,
    toggleAgendaDialog,
    addAgenda,
    updateAgenda,
    deleteAgenda,
  } = useProjectContext();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: null,
  });

  const open = agendaDialog;

  useEffect(() => {
    if (isEditingAgenda && agenda?.id) {
      setState({
        title: agenda.title,
        description: agenda.description,
        start: new Date(agenda.start),
        end: agenda.end && new Date(agenda.end),
      });
    }
  }, [isEditingAgenda, agenda]);

  function onClose() {
    if (loading) return;
    toggleAgendaDialog();
    setIsEditingAgenda(false);
    setErrors({});
    setState({
      title: "",
      description: "",
      start: new Date(),
      end: null,
    });
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

  function handleDateChange(name) {
    return function (value) {
      setState((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    };
  }

  function validateForm() {
    let errors = {};
    if (!state.title) errors.title = "Required";
    if (!state.start) errors.start = "Required";
    // if (!state.end) errors.end = "Required";
    if (state.end && isAfter(new Date(state.start), new Date(state.end)))
      errors.end = "Must be greater than start time";

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();

    handleOpenDialog(
      `<strong>You're about to delete ${agenda.title}</strong><p>This action can't be undone once deleting complete</p>`,
      "warning"
    );
  }

  async function confirmDelete(e) {
    e.preventDefault();

    try {
      await deleteAgenda(agenda);
      onClose();
      handleCloseDialog();
    } catch (err) {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

    try {
      if (isEditingAgenda) {
        await updateAgenda({
          id: agenda.id,
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
        });
      } else {
        await addAgenda({
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
        });
      }

      onClose();
    } catch (err) {}
    setLoading(false);
  }

  return (
    <>
      <MuiDialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        {isEditingAgenda && (
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
              error={Boolean(errors.title)}
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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                // views={["hours", "minutes"]}
                // openTo="hours"
                label="Start"
                value={state.start}
                onChange={handleDateChange("start")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    sx={{ mb: 2 }}
                    fullWidth
                    name="start"
                    error={Boolean(errors.start)}
                    helperText={errors.start}
                  />
                )}
              />

              <DateTimePicker
                // views={["hours", "minutes"]}
                // openTo="hours"
                label="End"
                value={state.end}
                onChange={handleDateChange("end")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ mb: 2 }}
                    fullWidth
                    name="end"
                    error={Boolean(errors.end)}
                    helperText={errors.end}
                  />
                )}
              />
            </LocalizationProvider>
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
      </MuiDialog>
      <Dialog dialog={dialog} onClose={handleCloseDialog}>
        <DialogActions>
          <Button disabled={loading} onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
