import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAgendaContext } from "context/agenda";

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart({ status, events, labels }) {
  const eventsByStatus = useMemo(
    () => events.filter((e) => e.status === status.value),
    [events, status]
  );

  const eventsByLabels = useMemo(
    () =>
      labels.map((l) => {
        return eventsByStatus.filter((e) => {
          if (!l.id) {
            return !e.labels.length;
          }

          return e.labels.find((el) => el.id === l.id);
        }).length;
      }),
    [labels, eventsByStatus]
  );

  const data = useMemo(() => {
    const backgroundColors = labels.map((l) => l.color);
    const borderColors = labels.map(() => "#fff");

    return {
      labels: labels.map((l) => l.title),
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
  }, [eventsByLabels, labels, status]);

  const totalEvents = eventsByStatus.length;
  const totalEventsWithMultiLabels = useMemo(
    () =>
      eventsByStatus.filter((e) => {
        const currLabels = e.labels.filter((el) =>
          labels.find((l) => el.id === l.id)
        );

        return currLabels.length > 1;
      }).length,
    [eventsByStatus, labels]
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ textAlign: "center" }}>
          {totalEvents} {status.title}
        </Typography>
        {totalEventsWithMultiLabels > 0 && (
          <Typography sx={{ textAlign: "center", fontSize: 12 }}>
            {totalEventsWithMultiLabels} with multiple labels
          </Typography>
        )}
        <Doughnut data={data} />
      </CardContent>
    </Card>
  );
}

export default function ProgressChart({ agenda }) {
  const {
    agenda: activeAgenda,
    getEvents,
    labels,
    statuses,
    selectAgenda,
  } = useAgendaContext();

  const allEvents = getEvents();
  const agendaEvents = useMemo(
    () => allEvents.filter((e) => e.agendaId === agenda.id),
    [allEvents, agenda]
  );

  const agendaLabels = useMemo(() => {
    const filteredLabels = labels
      .filter((e) => e.agendaId === agenda.id)
      .filter((e) => e.checked);
    filteredLabels.unshift({ title: "No label", color: "#000" });
    return filteredLabels;
  }, [labels, agenda]);

  const checkedStatuses = useMemo(
    () => statuses.filter((s) => s.checked),
    [statuses]
  );

  function handleSelectAgenda() {
    selectAgenda(agenda);
  }

  return (
    <>
      <FormControlLabel
        sx={{ px: 2, mt: 2 }}
        onChange={handleSelectAgenda}
        control={
          <Radio
            sx={{
              color: agenda.eventColor,
              "&.Mui-checked": {
                color: agenda.eventColor,
              },
            }}
            checked={activeAgenda?.id === agenda.id}
          />
        }
        label={agenda.title}
      />
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          alignItems: "stretch",
          flexWrap: "nowrap",
          gap: 1,
          px: 2,
        }}
      >
        {checkedStatuses.map((status, i) => (
          <Box key={i} sx={{ flex: 1, minWidth: "90%" }}>
            <Chart
              status={status}
              events={agendaEvents}
              labels={agendaLabels}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
