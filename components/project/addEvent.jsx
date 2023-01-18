import {
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useProjectContext } from "context/project";
import { isAfter } from "date-fns";

export default function AddEvent() {
  const { labels, selectedCell, setSelectedCell, addEvent } =
    useProjectContext();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
    labels: [],
  });

  const open = Boolean(selectedCell);

  function onClose() {
    if (loading) return;
    setErrors({});
    setSelectedCell(null);
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

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

    try {
      await addEvent({
        title: state.title,
        start: state.start,
        end: state.end,
        description: state.description,
        labels: state.labels,
      });
      onClose();
      setState({
        title: "",
        description: "",
        start: null,
        end: null,
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
