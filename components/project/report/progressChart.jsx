import { Box, Card, CardContent, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useProjectContext } from "context/project";
import { useCallback, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProgressChart() {
  const { labels, events, statuses } = useProjectContext();

  const checkedStatuses = useMemo(
    () => statuses.filter((l) => l.checked),
    [statuses]
  );

  const getEvents = useCallback(
    (status) => {
      const checkedLabels = labels.filter((l) => l.checked);

      return events
        .filter(
          (e) =>
            !e.labels.length ||
            checkedLabels.find((l) => e.labels.find((el) => el.id === l.id))
        )
        .filter((e) => e.status === status.value);
    },
    [events, labels]
  );

  const getData = useCallback(
    (status) => {
      const filteredEvents = events.filter((e) => e.status === status.value);
      const checkedLabels = labels.filter((l) => l.checked);
      checkedLabels.unshift({ title: "No label", color: "#000" });

      const eventsByLabels = checkedLabels.map((l) => {
        return filteredEvents.filter((e) => {
          if (!l.id) {
            return !e.labels.length;
          }

          return e.labels.find((el) => el.id === l.id);
        }).length;
      });

      const backgroundColors = checkedLabels.map((l) => l.color);
      const borderColors = checkedLabels.map(() => "#fff");

      return {
        labels: checkedLabels.map((l) => l.title),
        datasets: [
          {
            label: `${status.title} events`,
            data: eventsByLabels,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      };
    },
    [events, labels]
  );

  return (
    <Box
      sx={{
        display: "grid",
        grid: {
          xs: "auto",
          lg: `auto / repeat(${checkedStatuses.length}, 1fr)`,
        },
        gap: 2,
      }}
    >
      {checkedStatuses.map((status, i) => (
        <Card variant="outlined" key={i}>
          <CardContent>
            <Typography>
              {getEvents(status).length} {status.title}
            </Typography>
            <Doughnut data={getData(status)} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
