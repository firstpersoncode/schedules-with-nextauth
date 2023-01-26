import { Box, Tooltip } from "@mui/material";
import { isWithinInterval } from "date-fns";
import { useAgendaContext } from "context/agenda";
import { useMemo } from "react";
import formatDateRange from "utils/formatDateRange";

export default function TimeLineBar({ date }) {
  const { getTimeLines, getAgendaByTimeLine, openTimeLineDialog } =
    useAgendaContext();

  const selectedTimeLines = useMemo(() => {
    const timeLines = getTimeLines();

    let selectedTimeLines = timeLines.filter((timeLine) => {
      return isWithinInterval(new Date(date), {
        start: new Date(timeLine.start),
        end: new Date(timeLine.end),
      });
    });

    if (selectedTimeLines.length)
      selectedTimeLines = selectedTimeLines.map((t) => ({
        ...t,
        agenda: getAgendaByTimeLine(t),
      }));

    return selectedTimeLines;
  }, [date, getTimeLines, getAgendaByTimeLine]);

  function handleOpenTimeLineDialog(timeLine) {
    return function (e) {
      e.stopPropagation();
      openTimeLineDialog(timeLine);
    };
  }

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "33%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        // alignItems: "flex-start",
      }}
    >
      {selectedTimeLines.map((timeLine, i) => (
        <Tooltip
          key={i}
          title={`${timeLine.title} - ${formatDateRange(
            timeLine.start,
            timeLine.end
          )}`}
        >
          <Box
            onClick={handleOpenTimeLineDialog(timeLine)}
            sx={{
              flex: 1,
              minHeight: 15,
              backgroundColor: timeLine.agenda.color,
              opacity: 0.5,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
