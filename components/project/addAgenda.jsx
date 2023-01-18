import {
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import { useProjectContext } from "context/project";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { isAfter } from "date-fns";

export default function AddAgenda() {
  const { dialogNewAgenda, toggleDialogNewAgenda, addAgenda } =
    useProjectContext();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: null,
  });

  const open = dialogNewAgenda;

  function onClose() {
    if (loading) return;
    setErrors({});
    toggleDialogNewAgenda();
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

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    console.log(hasError);
    if (hasError) return;
    setLoading(true);

    try {
      await addAgenda({
        title: state.title,
        description: state.description,
        start: state.start,
        end: state.end,
      });

      onClose();
      setState({
        title: "",
        description: "",
        start: new Date(),
        end: null,
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
    </Dialog>
  );
}
