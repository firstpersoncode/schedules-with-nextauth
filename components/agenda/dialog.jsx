import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Dialog as MuiDialog,
  DialogActions,
  TextField,
  LinearProgress,
  IconButton,
  Typography,
  List,
  ListItem,
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Delete, Add, Close } from "@mui/icons-material";
import { MuiColorInput } from "mui-color-input";
import getRandomHex from "utils/getRandomHex";
import { useAgendaContext } from "context/agenda";
import { useDialog } from "components/dialog";
import validateAgendaStartEnd from "utils/validateAgendaStartEnd";
const Dialog = dynamic(() => import("components/dialog"));

export default function AgendaDialog() {
  const {
    agendaDialog,
    agenda,
    closeAgendaDialog,
    addAgenda,
    updateAgenda,
    deleteAgenda,
    deleteEventsByAgenda,
  } = useAgendaContext();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: null,
    description: null,
    start: new Date(),
    end: null,
    labels: [],
    color: getRandomHex(),
  });

  const open = agendaDialog;

  useEffect(() => {
    if (open && agenda?.id) {
      setState({
        title: agenda.title,
        description: agenda.description,
        start: new Date(agenda.start),
        end: new Date(agenda.end),
        labels: agenda.labels,
        color: agenda.color,
      });
    }
  }, [agenda, open]);

  function onClose() {
    if (loading) return;
    closeAgendaDialog();
    setErrors({});
    setState({
      title: null,
      description: null,
      start: new Date(),
      end: null,
      labels: [],
      color: state.color,
    });
  }

  function handleChange(name) {
    return function (e) {
      const value = name === "color" ? e : e.target.value;
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
    setErrors(errors);

    if (!state.title) errors.title = "Required";
    if (!state.start) errors.start = "Required";
    if (!state.end) errors.end = "Required";
    if (
      state.start &&
      state.end &&
      !validateAgendaStartEnd(state.start, state.end)
    ) {
      errors.start =
        "Invalid date range, start should be lower than ends and no more than 1 year";
      errors.end =
        "Invalid date range, ends should be greater than start and no more than 1 year";
    }
    if (!state.color) errors.color = "Required";
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
      deleteEventsByAgenda(agenda);
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
          color: state.color,
        });
      } else {
        await addAgenda({
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
          labels: state.labels,
          color: state.color,
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
              {agenda?.id && (
                <Tooltip title="Delete">
                  <IconButton disabled={loading} onClick={handleDelete}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <TextField
              required
              sx={{ mb: 2 }}
              label="Title"
              value={state.title || ""}
              onChange={handleChange("title")}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
            />

            <TextField
              label="Description"
              sx={{ mb: 2 }}
              value={state.description || ""}
              onChange={handleChange("description")}
              fullWidth
              multiline
              minRows={4}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  flexDirection: { xs: "column", lg: "row" },
                }}
              >
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
                      fullWidth
                      required
                      name="end"
                      error={Boolean(errors.end)}
                      helperText={errors.end}
                    />
                  )}
                />
              </Box>
            </LocalizationProvider>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", lg: "row" },
              }}
            >
              <MuiColorInput
                required
                label="Color"
                value={state.color}
                onChange={handleChange("color")}
                error={Boolean(errors.color)}
                helperText={errors.color}
                format="hex"
                isAlphaHidden
              />
              <List sx={{ p: 0 }}>
                {state.labels.map((label, i) => (
                  <ListItem
                    key={i}
                    sx={{ py: 0, pl: 0, mb: 2 }}
                    secondaryAction={
                      <Tooltip placement="right" title="Remove">
                        <IconButton edge="end" onClick={deleteLabel(i)}>
                          <Close />
                        </IconButton>
                      </Tooltip>
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

                <Tooltip placement="right" title="Add label">
                  <IconButton onClick={addLabel}>
                    <Add />
                  </IconButton>
                </Tooltip>
              </List>
            </Box>
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
      {dialog && (
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
      )}
    </>
  );
}
