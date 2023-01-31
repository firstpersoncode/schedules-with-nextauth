import { Box, Card as MuiCard, Typography, Chip } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { useAgendaContext } from "context/agenda";
import formatDateRange from "utils/formatDateRange";

export default function Card({ event, index }) {
  const { openEventDialog } = useAgendaContext();

  function handleClickEvent(e) {
    e.stopPropagation();
    openEventDialog({ start: event.start, end: event.end }, event);
  }

  return (
    <Draggable key={event.id} draggableId={event.id} index={index}>
      {(provided, snapshot) => {
        return (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            draggable
            sx={{ px: 1, my: 1 }}
          >
            <MuiCard
              sx={{ p: 2, cursor: "pointer" }}
              onClick={handleClickEvent}
            >
              <Typography sx={{ flex: 1, mb: 2 }}>{event.title}</Typography>
              <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                {event.labels.map((label, i) => (
                  <Chip
                    key={i}
                    label={label.title}
                    sx={{
                      backgroundColor: label.color,
                    }}
                  />
                ))}
              </Box>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 11,
                  textAlign: "right",
                }}
              >
                {formatDateRange(event.start, event.end)}
              </Typography>
            </MuiCard>
          </Box>
        );
      }}
    </Draggable>
  );
}
