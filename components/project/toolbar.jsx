import { Add, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useProjectContext } from "context/project";
import {
  differenceInCalendarMonths,
  differenceInDays,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

function timeLeft(startDate, endDate) {
  const years = differenceInYears(endDate, startDate);
  const months = differenceInCalendarMonths(endDate, startDate);
  const weeks = differenceInWeeks(endDate, startDate);
  const days = differenceInDays(endDate, startDate);

  if (years > 0) {
    return `${years} ${years > 1 ? "years" : "year"} left`;
  }

  if (months > 0) {
    return `${months} ${months > 1 ? "months" : "month"} left`;
  }

  if (weeks > 0) {
    return `${weeks} ${weeks > 1 ? "weeks" : "week"} left`;
  }

  return `${days} ${days > 1 ? "days" : "day"} left`;
}

export default function Toolbar() {
  const {
    project,
    loadingAgenda,
    agenda,
    agendas,
    selectAgenda,
    setIsEditingAgenda,
    toggleAgendaDialog,
  } = useProjectContext();

  async function handleSelectAgenda(_, v) {
    const selectedAgenda = agendas.find((p) => p.id === v.value);
    await selectAgenda(selectedAgenda);
  }

  function handleClickEditAgenda() {
    setIsEditingAgenda(true);
    toggleAgendaDialog();
  }

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "sticky",
        top: { xs: 55, lg: 60 },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
          }}
        >
          <Autocomplete
            sx={{ flex: 1, maxWidth: 300 }}
            disabled={loadingAgenda || !project?.id}
            options={agendas.map((p, i) => ({ label: p.title, value: p.id }))}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              );
            }}
            disableClearable
            blurOnSelect
            value={agenda?.title || null}
            isOptionEqualToValue={(o, v) => o.label === v}
            onChange={handleSelectAgenda}
            size="small"
            renderInput={(params) => (
              <TextField {...params} label="Agenda" variant="outlined" />
            )}
          />

          <IconButton
            disabled={!project?.id}
            onClick={toggleAgendaDialog}
            size="small"
          >
            <Add />
          </IconButton>

          {agenda?.id && (
            <IconButton
              onClick={handleClickEditAgenda}
              variant="contained"
              size="small"
            >
              <Edit />
            </IconButton>
          )}
        </Box>

        {agenda?.end && (
          <Chip
            label={timeLeft(new Date(agenda.start), new Date(agenda.end))}
          />
        )}
      </Box>

      {loadingAgenda && <LinearProgress />}
    </Card>
  );
}
