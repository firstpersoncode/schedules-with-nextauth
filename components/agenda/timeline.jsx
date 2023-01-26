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
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Delete } from "@mui/icons-material";
import { useAgendaContext } from "context/agenda";
import { useDialog } from "components/dialog";
import validateTimeLineStartEnd, {
  validateTimeLineStartEndOverlapping,
  validateTimeLineStartEndWithinAgenda,
} from "utils/validateTimeLineStartEnd";
const Dialog = dynamic(() => import("components/dialog"));

export default function TimeLine() {
  const {
    agenda: activeAgenda,
    agendas,
    getAgendaByTimeLine,
    closeTimeLineDialog,
    timeLineDialog,
    timeLines,
    timeLine,
    cell,
    addTimeLine,
    updateTimeLine,
    deleteTimeLine,
    timeLineTypes,
  } = useAgendaContext();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const open = timeLineDialog;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
    type: "",
  });

  const agenda = useMemo(() => {
    return activeAgenda || getAgendaByTimeLine(timeLine);
  }, [activeAgenda, timeLine, getAgendaByTimeLine]);

  useEffect(() => {
    if (timeLine?.id) {
      setState((v) => ({
        ...v,
        title: timeLine.title,
        description: timeLine.description,
        start: new Date(timeLine.start),
        end: new Date(timeLine.end),
        type: timeLine.type,
      }));
    }
  }, [timeLine]);

  useEffect(() => {
    if (agenda?.id) {
      setState((v) => ({
        ...v,
        agenda,
      }));
    } else if (agendas.length === 1) {
      setState((v) => ({
        ...v,
        agenda: agendas[0],
      }));
    }
  }, [agenda, agendas]);

  useEffect(() => {
    if (cell?.start) {
      const { start } = cell;
      setState((v) => ({ ...v, start: new Date(start) }));
    }

    if (cell?.start && cell?.end) {
      let { start, end } = cell;
      const dateStart = new Date(start);
      const hour = dateStart.getHours();
      if (hour > 22)
        end = new Date(new Date(new Date().setHours(hour)).setMinutes(59));
      setState((v) => ({ ...v, end: new Date(end) }));
    }
  }, [cell]);

  function onClose() {
    if (loading) return;
    closeTimeLineDialog();
    setErrors({});
    setState({
      title: "",
      description: "",
      start: null,
      end: null,
      type: "",
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
    if (!timeLine?.id && !state.agenda) errors.agenda = "Required";
    if (!state.title) errors.title = "Required";
    if (!state.type) errors.type = "Required";
    if (!state.start) errors.start = "Required";
    if (!state.end) errors.end = "Required";
    if (
      state.start &&
      state.end &&
      !validateTimeLineStartEnd(state.start, state.end)
    ) {
      errors.start =
        "Invalid date range, start should be lower than ends and no more than 1 day";
      errors.end =
        "Invalid date range, ends should be greater than start and no more than 1 day";
    } else if (
      state.start &&
      state.end &&
      state.agenda &&
      !validateTimeLineStartEndWithinAgenda(
        state.start,
        state.end,
        state.agenda
      )
    ) {
      errors.start =
        "Invalid date range, should start within the agenda timeline";
      errors.end = "Invalid date range, should ends within the agenda timeline";
    } else if (
      state.start &&
      state.end &&
      state.agenda &&
      !validateTimeLineStartEndOverlapping(
        state.start,
        state.end,
        timeLines.filter((t) => t.agendaId === state.agenda.id)
      )
    ) {
      errors.start =
        "Invalid date range, should not overlap with other timelines";
      errors.end =
        "Invalid date range, should not overlap with other timelines";
    }

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();

    handleOpenDialog(
      `<strong>You're about to delete ${timeLine.title}</strong><p>This action can't be undone once deleting complete</p>`,
      "warning"
    );
  }

  async function confirmDelete(e) {
    e.preventDefault();

    try {
      await deleteTimeLine(timeLine);
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
      if (timeLine?.id) {
        await updateTimeLine({
          id: timeLine.id,
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
          type: state.type,
        });
      } else {
        await addTimeLine({
          title: state.title,
          description: state.description,
          start: state.start,
          end: state.end,
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
            {timeLine?.id && agenda?.id && (
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
                <Tooltip title="Delete">
                  <IconButton disabled={loading} onClick={handleDelete}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {!timeLine?.id && agendas.length > 0 && (
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

            <TextField
              label="Description"
              sx={{ mb: 2 }}
              value={state.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              minRows={4}
            />

            <TextField
              required
              sx={{ mb: 2 }}
              select
              fullWidth
              label="Type"
              value={state.type}
              onChange={handleChange("type")}
              error={Boolean(errors.type)}
              helperText={errors.type}
            >
              {timeLineTypes.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", lg: "row" },
                }}
              >
                <DateTimePicker
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
                  label="End"
                  value={state.end}
                  onChange={handleDateChange("end")}
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
