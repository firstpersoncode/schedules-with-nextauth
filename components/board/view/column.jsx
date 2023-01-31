import { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import Card from "./card";

export default function Column({ agenda, column }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        minWidth: "33%",
        minHeight: "50vh",
        backgroundColor: "#eee",
        boxSizing: "border-box",
      }}
    >
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => {
          return (
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Typography
                sx={{
                  p: 2,
                  backgroundColor: agenda.color,
                }}
              >
                {column.title}
              </Typography>
              <Box
                sx={{ flex: 1 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {column.events.map((event, i) => (
                  <Card key={i} index={i} event={event} />
                ))}
                {provided.placeholder}
              </Box>
            </Box>
          );
        }}
      </Droppable>
    </Paper>
  );
}
