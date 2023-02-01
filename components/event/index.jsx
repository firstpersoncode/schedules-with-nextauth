import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Dialog as MuiDialog,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { add, isAfter, isBefore } from "date-fns";
import { useCommonContext } from "context/common";
import { useAgendaContext } from "context/agenda";
import { repeats } from "context/agenda/controller/event";
import { useDialog } from "components/dialog";
const Dialog = dynamic(() => import("components/dialog"));

const Write = dynamic(() => import("./write"));
const Read = dynamic(() => import("./read"));

export default function Event() {
  const { eventDialog } = useCommonContext();
  const {
    agenda: activeAgenda,
    getAgendaByEvent,
    closeEventDialog,
    event,
    deleteEvent,
    cancelEvent,
  } = useAgendaContext();

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const open = eventDialog;
  const [write, setWrite] = useState(!Boolean(event?.id));
  const [loading, setLoading] = useState(false);

  const agenda = useMemo(() => {
    return activeAgenda || getAgendaByEvent(event);
  }, [activeAgenda, event, getAgendaByEvent]);

  function toggleLoading() {
    setLoading((v) => !v);
  }

  function toggleWrite() {
    setWrite((v) => !v);
  }

  function handleClose() {
    closeEventDialog();
  }

  async function handleDelete() {
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
            const agendaEnd = new Date(agenda.end);
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
        handleClose();
        handleCloseDialog();
      } catch (err) {
        console.error(err);
      }
    };
  }

  return (
    <>
      <MuiDialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
        <Box>
          {loading && <LinearProgress />}
          <Box sx={{ p: 2 }}>
            {write ? (
              <Write
                loading={loading}
                agenda={agenda}
                event={event}
                onClose={handleClose}
                onDelete={handleDelete}
                toggleLoading={toggleLoading}
                toggleWrite={toggleWrite}
              />
            ) : (
              <Read
                agenda={agenda}
                event={event}
                onClose={handleClose}
                onDelete={handleDelete}
                toggleLoading={toggleLoading}
                toggleWrite={toggleWrite}
              />
            )}
          </Box>
        </Box>
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
