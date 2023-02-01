import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  TextField,
  Autocomplete,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ChevronLeft, Close, Delete } from "@mui/icons-material";
import { add } from "date-fns";
import validateEventStartEnd from "utils/validateEventStartEnd";
import updateEventScheduleByStatus from "utils/updateEventScheduleByStatus";
import { useAgendaContext } from "context/agenda";
import { repeatOptions } from "context/agenda/controller/event";

export default function Write({
  loading,
  agenda,
  event,
  onClose,
  onDelete,
  toggleLoading,
  toggleWrite,
}) {
  const {
    agendas,
    slot,
    getStatusesByAgenda,
    addEvent,
    updateEvent,
    cancelEvent,
  } = useAgendaContext();

  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: null,
    description: null,
    start: new Date(),
    end: add(new Date(), { minutes: 30 }),
    labels: [],
    status: null,
    repeat: null,
  });

  const statuses = useMemo(() => {
    return getStatusesByAgenda(state.agenda);
  }, [state.agenda, getStatusesByAgenda]);

  useEffect(() => {
    if (event?.id) {
      setState((v) => ({
        ...v,
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        labels: event.labels,
        status: event.status,
        repeat: event.repeat,
      }));
    } else {
      const status = statuses.filter((s) => s.type === "TODO")[0];
      setState((v) => ({
        ...v,
        status,
      }));
    }
  }, [event, statuses]);

  useEffect(() => {
    if (agenda?.id) {
      setState((v) => ({
        ...v,
        agenda,
      }));
    }
  }, [agenda]);

  useEffect(() => {
    if (slot?.start) {
      const { start } = slot;
      setState((v) => ({ ...v, start: new Date(start) }));
    }

    if (slot?.start && slot?.end) {
      let { start, end } = slot;
      const dateStart = new Date(start);
      const hour = dateStart.getHours();
      if (hour > 22)
        end = new Date(new Date(new Date().setHours(hour)).setMinutes(59));
      setState((v) => ({ ...v, end: new Date(end) }));
    }
  }, [slot]);

  useEffect(() => {
    if (event?.id && state.status) {
      const res = updateEventScheduleByStatus(event, state.status);
      setState((v) => ({
        ...v,
        start: res.start,
        end: res.end,
      }));
    }
  }, [state.status, event]);

  function handleClose() {
    setErrors({});
    setState({
      title: null,
      description: null,
      start: new Date(),
      end: add(new Date(), { minutes: 30 }),
      labels: [],
      status: null,
      repeat: null,
    });
    onClose();
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

  function handleSelectStatus(_, status) {
    setState((prev) => {
      return {
        ...prev,
        status,
      };
    });
    setErrors((v) => ({ ...v, status: undefined }));
  }

  function handleSelectAgenda(_, agenda) {
    setState((prev) => {
      return {
        ...prev,
        agenda,
        labels: [],
        status: null,
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
    if (!state.status) errors.status = "Required";
    if (!state.title) errors.title = "Required";
    if (!state.start) errors.start = "Required";
    if (!state.end) errors.end = "Required";
    if (
      state.start &&
      state.end &&
      !validateEventStartEnd(state.start, state.end)
    ) {
      errors.start = "Invalid date range, start should be lower than ends";
      errors.end = "Invalid date range, ends should be greater than start";
    }

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();
    onDelete();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    toggleLoading();

    try {
      if (event?.id) {
        if (event.repeat) {
          event.cancelledAt.push(new Date(event.start));
          await cancelEvent({
            id: event.id,
            cancelledAt: event.cancelledAt,
          });

          await addEvent({
            title: state.title,
            description: state.description,
            start: state.start,
            end: state.end,
            labels: state.labels,
            agenda: state.agenda,
            status: state.status,
            cancelledAt: [],
          });
        } else {
          await updateEvent({
            id: event.id,
            title: state.title,
            description: state.description,
            start: state.start,
            end: state.end,
            labels: state.labels,
            status: state.status,
          });
        }
      } else {
        await addEvent({
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
          labels: state.labels,
          status: state.status,
          agenda: state.agenda,
          repeat: state.repeat,
          cancelledAt: [],
        });
      }

      handleClose();
    } catch (err) {}
    toggleLoading();
  }

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        {event?.id ? (
          <Tooltip title="Back">
            <IconButton onClick={toggleWrite}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}
        <Box>
          {event?.id && (
            <Tooltip title="Delete">
              <IconButton disabled={loading} onClick={handleDelete}>
                <Delete />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close">
            <IconButton disabled={loading} onClick={handleClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 1,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Autocomplete
          disabled={Boolean(event?.id && agenda?.id)}
          value={state.agenda || null}
          options={agendas}
          getOptionLabel={(o) => o.title}
          onChange={handleSelectAgenda}
          disableClearable
          blurOnSelect
          fullWidth
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

        <Autocomplete
          disabled={!state.agenda?.labels?.length}
          multiple
          options={state.agenda?.labels || []}
          getOptionLabel={(o) => o.title}
          value={state.labels}
          fullWidth
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
            <TextField {...params} label="Labels" variant="outlined" />
          )}
        />
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
            gap: 1,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          <DateTimePicker
            label="Start"
            value={state.start}
            onChange={handleDateChange("start")}
            disabled={Boolean(state.status && state.status.type !== "TODO")}
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
            label="End"
            value={state.end}
            onChange={handleDateChange("end")}
            disabled={Boolean(state.status && state.status.type !== "TODO")}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
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
          mt: 2,
          display: "flex",
          gap: 1,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Autocomplete
          required
          disabled={!state.agenda?.id}
          value={state.status || null}
          options={statuses}
          getOptionLabel={(o) => o.title}
          getOptionDisabled={(o) => !event?.id && o.type !== "TODO"}
          onChange={handleSelectStatus}
          disableClearable
          blurOnSelect
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              variant="outlined"
              error={Boolean(errors.status)}
              helperText={errors.status}
            />
          )}
        />

        <TextField
          fullWidth
          select
          label={state.repeat ? "Repeat" : "One time"}
          disabled={Boolean(event?.id)}
          value={state.repeat || ""}
          onChange={handleChange("repeat")}
          error={Boolean(errors.repeat)}
          helperText={errors.repeat}
        >
          <MenuItem value={null}>One time</MenuItem>
          {repeatOptions.map((option, i) => (
            <MenuItem key={i} value={option.value}>
              {option.title}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={handleSubmit}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}
