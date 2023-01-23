import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog as MuiDialog,
  DialogActions,
  TextField,
  LinearProgress,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Delete, Add } from "@mui/icons-material";
import { isAfter } from "date-fns";
import { useAgendaContext } from "context/agenda";
import Dialog, { useDialog } from "components/dialog";
import getRandomHex from "utils/getRandomHex";
import { MuiColorInput } from "mui-color-input";

export default function AgendaDialog() {
  const {
    agendaDialog,
    agenda,
    closeAgendaDialog,
    addAgenda,
    updateAgenda,
    deleteAgenda,
  } = useAgendaContext();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: null,
    labels: [],
    eventColor: getRandomHex(),
  });

  const open = agendaDialog;

  useEffect(() => {
    if (open && agenda?.id) {
      setState({
        title: agenda.title,
        description: agenda.description,
        start: new Date(agenda.start),
        end: agenda.end && new Date(agenda.end),
        labels: agenda.labels,
        eventColor: agenda.eventColor,
      });
    }
  }, [agenda, open]);

  function onClose() {
    if (loading) return;
    closeAgendaDialog();
    setErrors({});
    setState({
      title: "",
      description: "",
      start: new Date(),
      end: null,
      labels: [],
      eventColor: state.eventColor,
    });
  }

  function handleChange(name) {
    return function (e) {
      const value = name === "eventColor" ? e : e.target.value;
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
      setErrors((v) => ({ ...v, [name]: undefined }));
    };
  }

  function addLabel() {
    setState((v) => ({
      ...v,
      labels: [...v.labels, { title: "", color: getRandomHex() }],
    }));
  }

  function deleteLabel(i) {
    return function () {
      const labels = [...state.labels];
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
      setErrors({ labels: undefined });
    };
  }

  function handleChangeLabelColor(i) {
    return function (e) {
      const labels = state.labels;
      const selectedLabel = labels[i];
      selectedLabel.color = e;
      labels[i] = selectedLabel;
      setState((v) => ({ ...v, labels }));
      setErrors({ labels: undefined });
    };
  }

  function validateForm() {
    let errors = {};
    if (!state.title) errors.title = "Required";
    if (!state.start) errors.start = "Required";
    if (!state.eventColor) errors.eventColor = "Required";
    // if (!state.end) errors.end = "Required";
    if (state.end && isAfter(new Date(state.start), new Date(state.end)))
      errors.end = "Must be greater than start time";
    if (state.labels.length) {
      if (state.labels.find((l) => !Boolean(l.color)))
        errors.labels = "Color Required";
      if (state.labels.find((l) => !Boolean(l.title)))
        errors.labels = "Name Required";
    }

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();

    handleOpenDialog(
      `<strong>You're about to delete ${agenda.title}</strong> including all the associated events with this agenda.<p>This action can't be undone once deleting complete</p>`,
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
      if (agenda?.id) {
        await updateAgenda({
          id: agenda.id,
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
          labels: state.labels,
          eventColor: state.eventColor,
        });
      } else {
        await addAgenda({
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
          labels: state.labels,
          eventColor: state.eventColor,
        });
      }

      onClose();
    } catch (err) {}
    setLoading(false);
  }

  return (
    <>
      <MuiDialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <Box>
          {loading && <LinearProgress />}
          <Box sx={{ p: 2 }}>
            {agenda?.id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography sx={{ mb: 4, fontWeight: "bold", fontSize: 20 }}>
                  Agenda
                </Typography>
                <IconButton disabled={loading} onClick={handleDelete}>
                  <Delete />
                </IconButton>
              </Box>
            )}

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

            <MuiColorInput
              required
              sx={{ mb: 2 }}
              label="Event Color"
              value={state.eventColor}
              onChange={handleChange("eventColor")}
              fullWidth
              error={Boolean(errors.eventColor)}
              helperText={errors.eventColor}
              format="hex"
              isAlphaHidden
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
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      label="Label"
                      value={label.title}
                      onChange={handleChangeLabel(i)}
                      fullWidth
                    />
                    <MuiColorInput
                      label="Color"
                      value={label.color}
                      onChange={handleChangeLabelColor(i)}
                      format="hex"
                      fullWidth
                      isAlphaHidden
                    />
                  </Box>
                </ListItem>
              ))}

              {errors.labels && (
                <Typography sx={{ fontSize: 12, mb: 2, mx: 2 }} color="error">
                  {errors.labels}
                </Typography>
              )}

              <Button
                onClick={addLabel}
                variant="contained"
                startIcon={<Add />}
              >
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
