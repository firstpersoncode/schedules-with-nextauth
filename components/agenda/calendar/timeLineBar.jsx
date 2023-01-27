import { useMemo } from "react";
import { Box, Tooltip } from "@mui/material";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { useAgendaContext } from "context/agenda";
import formatDateRange from "utils/formatDateRange";

export default function TimeLineBar({ date }) {
  const { agendas } = useAgendaContext();

  const selectedTimeLines = useMemo(() => {
    let selectedTimeLines = agendas.filter((agenda) => {
      return (
        agenda.checked &&
        isWithinInterval(new Date(date), {
          start: startOfDay(new Date(agenda.start)),
          end: endOfDay(new Date(agenda.end)),
        })
      );
    });

    return selectedTimeLines;
  }, [date, agendas]);

  return (
    <Box
      sx={{
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        // alignItems: "flex-start",
      }}
    >
      {selectedTimeLines.map((agenda, i) => (
        <Tooltip
          key={i}
          title={`${agenda.title} - ${formatDateRange(
            agenda.start,
            agenda.end
          )}`}
        >
          <Box
            sx={{
              flex: 1,
              backgroundColor: agenda.color,
              opacity: 0.5,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
