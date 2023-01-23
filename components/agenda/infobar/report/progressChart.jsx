import { useCallback, useMemo } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAgendaContext } from "context/agenda";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProgressChart() {
  const { labels, getEvents, statuses } = useAgendaContext();

  const events = getEvents();

  const checkedStatuses = useMemo(
    () => statuses.filter((l) => l.checked),
    [statuses]
  );

  const getEventsByStatus = useCallback(
    (status) => events.filter((e) => e.status === status.value),
    [events]
  );

  const getData = useCallback(
    (status) => {
      const filteredEvents = getEventsByStatus(status);
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
    <>
      {checkedStatuses.map((status, i) => (
        <Card variant="outlined" key={i}>
          <CardContent>
            <Typography>
              {getEventsByStatus(status).length} {status.title}
            </Typography>
            <Doughnut data={getData(status)} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
