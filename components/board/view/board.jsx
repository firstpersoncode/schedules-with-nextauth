import { useState, useMemo, useEffect } from "react";
import {
  Stack,
  Divider,
  Typography,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import { useAgendaContext } from "context/agenda";
import updateEventScheduleByStatus from "utils/updateEventScheduleByStatus";
import Dialog, { useDialog } from "components/dialog";
import Column from "./column";
import { Add } from "@mui/icons-material";

export default function Board({ agenda }) {
  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const {
    statuses,
    getEvents,
    addEvent,
    updateEvent,
    cancelEvent,
    openEventDialog,
  } = useAgendaContext();

  function handleAddEvent() {
    openEventDialog(null, null, agenda);
  }

  const agendaStatuses = useMemo(
    () => statuses.filter((s) => s.agendaId === agenda.id),
    [statuses, agenda]
  );

  const agendaEvents = useMemo(() => {
    const res = getEvents();
    return res.filter((e) => e.agendaId === agenda.id);
  }, [getEvents, agenda]);

  const initialColumns = useMemo(() => {
    return agendaStatuses.map((s) => ({
      ...s,
      events: agendaEvents
        .filter((e) => e.status && e.status.id === s.id)
        .sort((a, b) => {
          return new Date(a.start) - new Date(b.start);
        }),
    }));
  }, [agendaStatuses, agendaEvents]);

  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  async function onDragEnd(res) {
    if (!res.destination) return;
    const sourceColumnId = res.source.droppableId;
    const targetColumnId = res.destination.droppableId;
    if (sourceColumnId === targetColumnId) {
      if (res.source.index !== res.destination.index)
        handleOpenDialog("Reording event is not allowed", "error");
      return;
    }

    const eventId = res.draggableId;
    const sourceColumn = columns.find((c) => c.id === sourceColumnId);
    sourceColumn.events = sourceColumn.events.filter((e) => e.id !== eventId);

    const status = agendaStatuses.find((s) => s.id === targetColumnId);
    const event = agendaEvents.find((e) => e.id === eventId);
    const updatedSchedule = updateEventScheduleByStatus(event, status);
    const updatedEvent = {
      ...event,
      ...updatedSchedule,
      status,
    };

    const targetColumn = columns.find((c) => c.id === targetColumnId);
    targetColumn.events = [updatedEvent, ...targetColumn.events];
    const updatedColumns = columns.map((c) => {
      if (c.id === sourceColumn.id) c = sourceColumn;
      else if (c.id === targetColumn.id) c = targetColumn;
      return c;
    });

    try {
      if (updatedEvent.repeat) {
        updatedEvent.cancelledAt.push(new Date(updatedEvent.start));
        await cancelEvent({
          id: updatedEvent.id,
          cancelledAt: updatedEvent.cancelledAt,
        });

        await addEvent({
          ...updatedEvent,
          cancelledAt: [],
        });
      } else {
        await updateEvent(updatedEvent);
      }

      setColumns(updatedColumns);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Divider sx={{ my: 1 }} textAlign="left">
        <Typography sx={{ fontSize: 24 }}>{agenda.title}</Typography>
      </Divider>
      <Box sx={{ px: 2 }}>
        <Tooltip title="Create Event">
          <Button
            sx={{ my: 1 }}
            variant="contained"
            onClick={handleAddEvent}
            size="small"
          >
            <Add />
          </Button>
        </Tooltip>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ p: 2, width: "100%", overflowX: "auto" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              minWidth: 700,
            }}
          >
            {columns.map((column, i) => (
              <Column key={column.id} agenda={agenda} column={column} />
            ))}
          </Stack>
        </Box>
      </DragDropContext>

      {dialog && <Dialog dialog={dialog} onClose={handleCloseDialog} />}
    </>
  );
}
