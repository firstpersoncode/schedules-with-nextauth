import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Dialog as MuiDialog,
  DialogActions,
  TextField,
  LinearProgress,
  Autocomplete,
  MenuItem,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { isAfter } from "date-fns";
import { Delete } from "@mui/icons-material";
import { useAgendaContext } from "context/agenda";
import { useDialog } from "components/dialog";
import validateEventStartEnd, {
  validateEventStartEndWithinAgenda,
} from "utils/validateEventStartEnd";
const Dialog = dynamic(() => import("components/dialog"));

export default function Event() {
  const {
    agendas,
    getAgendaByEvent,
    closeEventDialog,
    eventDialog,
    event,
    cell,
    addEvent,
    updateEvent,
    deleteEvent,
    statuses,
  } = useAgendaContext();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const open = eventDialog;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
    labels: [],
    status: "TODO",
    type: "TASK",
  });

  const agenda = useMemo(() => {
    return getAgendaByEvent(event);
  }, [event, getAgendaByEvent]);

  useEffect(() => {
    if (event?.id) {
      setState({
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        labels: event.labels,
        status: event.status,
        type: event.type,
        agenda,
      });
    } else if (agendas.length === 1) {
      setState((s) => ({
        ...s,
        agenda: agendas[0],
      }));
    }
  }, [event, agenda, agendas]);

  useEffect(() => {
    if (cell) {
      let { start, end } = cell;
      const dateStart = new Date(start);
      const hour = dateStart.getHours();
      if (hour > 22)
        end = new Date(new Date(new Date().setHours(hour)).setMinutes(59));
      setState((v) => ({ ...v, start: new Date(start), end: new Date(end) }));
    }
  }, [cell]);

  function onClose() {
    if (loading) return;
    closeEventDialog();
    setErrors({});
    setState({
      title: "",
      description: "",
      start: null,
      end: null,
      labels: [],
      status: "TODO",
      type: "TASK",
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

  function handleSelectAgenda(_, agenda) {
    setState((prev) => {
      return {
        ...prev,
        agenda,
      };
    });
    setErrors((v) => ({ ...v, agenda: undefined }));
  }

  function handleSelectLabel(_, labels) {
    setState((prev) => {
      return {
        ...prev,
        labels,
      };
    });
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

  function validateForm() {
    let errors = {};
    setErrors(errors);
    if (!event?.id && !state.agenda) errors.agenda = "Required";
    if (!state.title) errors.title = "Required";
    if (!state.start) errors.start = "Required";
    if (!state.end) errors.end = "Required";
    if (
      state.start &&
      state.end &&
      !validateEventStartEnd(state.start, state.end)
    ) {
      errors.start =
        "Invalid date range, start should be lower than ends and no more than 1 day";
      errors.end =
        "Invalid date range, ends should be greater than start and no more than 1 day";
    } else if (
      state.start &&
      state.end &&
      state.agenda &&
      !validateEventStartEndWithinAgenda(state.start, state.end, state.agenda)
    ) {
      errors.start =
        "Invalid date range, should start within the agenda timeline";
      errors.end = "Invalid date range, should ends within the agenda timeline";
    }

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();

    handleOpenDialog(
      `<strong>You're about to delete ${event.title}</strong><p>This action can't be undone once deleting complete</p>`,
      "warning"
    );
  }

  async function confirmDelete(e) {
    e.preventDefault();

    try {
      await deleteEvent(event);
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
      if (event?.id) {
        await updateEvent({
          id: event.id,
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
          labels: state.labels,
          status: state.status,
          type: state.type,
        });
      } else {
        await addEvent({
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
          labels: state.labels,
          status: state.status,
          type: state.type,
          agenda: state.agenda,
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
            {event?.id && agenda?.id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography sx={{ mb: 4, fontWeight: "bold", fontSize: 20 }}>
                  {agenda.title}
                </Typography>
                <IconButton disabled={loading} onClick={handleDelete}>
                  <Delete />
                </IconButton>
              </Box>
            )}

            {!event?.id && agendas.length > 0 && (
              <Autocomplete
                sx={{ mb: 2 }}
                value={state.agenda || null}
                options={agendas}
                getOptionLabel={(o) => o.title}
                onChange={handleSelectAgenda}
                disableClearable
                blurOnSelect
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Agenda"
                    variant="outlined"
                    error={Boolean(errors.agenda)}
                    helperText={errors.agenda}
                  />
                )}
              />
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

            <Autocomplete
              disabled={!state.agenda?.labels?.length}
              multiple
              options={state.agenda?.labels || []}
              getOptionLabel={(o) => o.title}
              value={state.labels}
              renderTags={(v, getTagProps) =>
                v.map((val, i) => (
                  <Chip
                    {...getTagProps(i)}
                    key={i}
                    sx={{ backgroundColor: val.color }}
                    label={val.title}
                  />
                ))
              }
              onChange={handleSelectLabel}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Labels"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}
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
                views={["hours", "minutes"]}
                openTo="hours"
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
                views={["hours", "minutes"]}
                openTo="hours"
                label="End"
                value={state.end}
                onChange={handleDateChange("end")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    sx={{ mb: 2 }}
                    fullWidth
                    name="end"
                    error={Boolean(errors.end)}
                    helperText={errors.end}
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              select
              fullWidth
              label="Status"
              value={state.status}
              onChange={handleChange("status")}
            >
              {statuses.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField>
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
