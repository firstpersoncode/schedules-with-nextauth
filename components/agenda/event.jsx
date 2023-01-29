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
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Delete } from "@mui/icons-material";
import { add, differenceInMinutes, isAfter, isBefore, sub } from "date-fns";
import { useAgendaContext } from "context/agenda";
import { repeats, repeatOptions } from "context/agenda/controller/event";
import { useDialog } from "components/dialog";
import validateEventStartEnd from "utils/validateEventStartEnd";
const Dialog = dynamic(() => import("components/dialog"));

export default function Event() {
  const {
    agenda: activeAgenda,
    agendas,
    getAgendaByEvent,
    closeEventDialog,
    eventDialog,
    event,
    cell,
    addEvent,
    updateEvent,
    deleteEvent,
    cancelEvent,
    statuses,
  } = useAgendaContext();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const open = eventDialog;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    title: null,
    description: null,
    start: null,
    end: null,
    labels: [],
    status: null,
    repeat: null,
  });

  const agenda = useMemo(() => {
    return activeAgenda || getAgendaByEvent(event);
  }, [activeAgenda, event, getAgendaByEvent]);

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
    }
  }, [event]);

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

  useEffect(() => {
    if (event?.id) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      if (event.status !== state.status) {
        const now = new Date();
        if (state.status === "COMPLETED") {
          if (isAfter(eventStart, now)) {
            const durationInMinutes = differenceInMinutes(eventEnd, eventStart);
            setState((v) => ({
              ...v,
              start: sub(now, { minutes: durationInMinutes }),
              end: now,
            }));
          } else {
            const durationInMinutes = differenceInMinutes(now, eventStart);
            setState((v) => ({
              ...v,
              start: eventStart,
              end: add(eventStart, { minutes: durationInMinutes }),
            }));
          }
        } else {
          if (isBefore(eventEnd, now)) {
            const durationInMinutes = differenceInMinutes(eventEnd, eventStart);
            setState((v) => ({
              ...v,
              start: now,
              end: add(now, { minutes: durationInMinutes }),
            }));
          } else {
            setState((v) => ({
              ...v,
              start: now,
              end: eventEnd,
            }));
          }
        }
      } else {
        setState((v) => ({
          ...v,
          start: eventStart,
          end: eventEnd,
        }));
      }
    }
  }, [state.status, event]);

  function onClose() {
    if (loading) return;
    closeEventDialog();
    setErrors({});
    setState({
      title: null,
      description: null,
      start: null,
      end: null,
      labels: [],
      status: null,
      repeat: null,
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
        labels: [],
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
      errors.start = "Invalid date range, start should be lower than ends";
      errors.end = "Invalid date range, ends should be greater than start";
    }
    // if (
    //   !event?.id &&
    //   state.start &&
    //   state.end &&
    //   state.agenda &&
    //   !validateEventStartEndWithinAgenda(state.start, state.end, state.agenda)
    // ) {
    //   errors.start =
    //     "Invalid date range, should start within the agenda timeline";
    //   errors.end = "Invalid date range, should ends within the agenda timeline";
    // }

    setErrors(errors);
    return errors;
  }

  async function handleDelete(e) {
    e.preventDefault();
    let dialog = `<strong>You're about to delete ${event.title}</strong><p>This action can't be undone once deleting complete</p>`;

    if (event.repeat) {
      dialog = `<strong>You're about to delete ${event.title}</strong><p>This is repeated events, choose what to delete.</p>`;
    }

    handleOpenDialog(dialog, "warning");
  }

  function confirmDelete(deleteType) {
    return async function (e) {
      e.preventDefault();

      try {
        let eventStart = new Date(event.start);
        event.cancelledAt.push(eventStart);

        switch (deleteType) {
          case "this": {
            await cancelEvent({
              id: event.id,
              cancelledAt: event.cancelledAt,
            });
            break;
          }
          case "thisAndOthers": {
            const agendaEnd = new Date(state.agenda.end);
            while (isBefore(eventStart, agendaEnd)) {
              eventStart = add(eventStart, {
                [repeats[event.repeat]]: 1,
              });
              if (isAfter(eventStart, agendaEnd)) break;
              event.cancelledAt.push(eventStart);
            }
            await cancelEvent({
              id: event.id,
              cancelledAt: event.cancelledAt,
            });
            break;
          }
          case "all": {
            await deleteEvent(event);
            break;
          }
        }
        onClose();
        handleCloseDialog();
      } catch (err) {
        console.error(err);
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

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
          status: "TODO",
          agenda: state.agenda,
          repeat: state.repeat,
          cancelledAt: [],
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
            {event?.id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 4,
                }}
              >
                <TextField
                  required
                  select
                  label="Status"
                  value={state.status || ""}
                  onChange={handleChange("status")}
                  error={Boolean(errors.status)}
                  helperText={errors.status}
                >
                  {statuses.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
                </TextField>
                <Tooltip title="Delete">
                  <IconButton disabled={loading} onClick={handleDelete}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <Box
              sx={{
                mb: 2,
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", lg: "row" },
              }}
            >
              <Autocomplete
                disabled={event?.id && agenda?.id}
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
                  gap: 2,
                  flexDirection: { xs: "column", lg: "row" },
                }}
              >
                <DateTimePicker
                  label="Start"
                  value={state.start}
                  onChange={handleDateChange("start")}
                  disabled={state.status && state.status !== "TODO"}
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
                  disabled={state.status && state.status !== "TODO"}
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

            <TextField
              sx={{ mt: 2 }}
              select
              fullWidth
              label={state.repeat ? "Repeat" : "One time"}
              disabled={event?.id}
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
            {event?.repeat ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    fontSize: 12,
                    textTransform: "unset",
                    textAlign: "left",
                  }}
                  disabled={loading}
                  onClick={confirmDelete("this")}
                >
                  Only for this event
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    fontSize: 12,
                    textTransform: "unset",
                    textAlign: "left",
                  }}
                  disabled={loading}
                  onClick={confirmDelete("thisAndOthers")}
                >
                  This event and next repeated events
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    fontSize: 12,
                    textTransform: "unset",
                    textAlign: "left",
                  }}
                  disabled={loading}
                  onClick={confirmDelete("all")}
                >
                  All repeated events
                </Button>
                <Button disabled={loading} onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <Button disabled={loading} onClick={confirmDelete("all")}>
                  Delete
                </Button>
                <Button disabled={loading} onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
