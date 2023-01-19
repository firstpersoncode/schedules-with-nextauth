import {
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  LinearProgress,
  Autocomplete,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useProjectContext } from "context/project";
import { isAfter } from "date-fns";
import { Delete } from "@mui/icons-material";

export default function EventDialog() {
  const {
    event,
    eventDialog,
    isEditingEvent,
    labels,
    selectedCell,
    setSelectedCell,
    setIsEditingEvent,
    toggleEventDialog,
    addEvent,
    updateEvent,
    deleteEvent,
    statuses,
  } = useProjectContext();

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

  const open = eventDialog;

  useEffect(() => {
    if (isEditingEvent && event?.id) {
      setState({
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        labels: event.labels,
        status: event.status,
        type: event.type,
      });
    }
  }, [isEditingEvent, event]);

  function onClose() {
    if (loading) return;
    toggleEventDialog();
    setIsEditingEvent(false);
    setSelectedCell(null);
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

  useEffect(() => {
    if (selectedCell) {
      let { start, end } = selectedCell;
      const dateStart = new Date(start);
      const hour = dateStart.getHours();
      if (hour > 22)
        end = new Date(new Date(new Date().setHours(hour)).setMinutes(59));
      setState((v) => ({ ...v, start: new Date(start), end: new Date(end) }));
    }
  }, [selectedCell]);

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
    };
  }

  function validateForm() {
    let errors = {};
    if (!state.title) errors.title = "Required";
    if (!state.start) errors.start = "Required";
    if (!state.end) errors.end = "Required";
    else if (isAfter(new Date(state.start), new Date(state.end)))
      errors.end = "Must be greater than start time";

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();

    try {
      await deleteEvent(event);
      onClose();
    } catch (err) {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

    try {
      if (isEditingEvent) {
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
        });
      }

      onClose();
    } catch (err) {}
    setLoading(false);
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      {isEditingEvent && (
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
          {labels.length > 0 && (
            <Autocomplete
              multiple
              options={labels}
              getOptionLabel={(o) => o.title}
              value={state.labels}
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
          )}
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
    </Dialog>
  );
}