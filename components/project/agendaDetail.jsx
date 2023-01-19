import { Add, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useProjectContext } from "context/project";
import {
  differenceInCalendarMonths,
  differenceInDays,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";
import { useMemo } from "react";

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

export default function AgendaDetail() {
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
    <>
      {loadingAgenda && <LinearProgress />}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          gap: 1,
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
          <>
            <IconButton
              onClick={handleClickEditAgenda}
              variant="contained"
              size="small"
            >
              <Edit />
            </IconButton>

            {agenda.end && (
              <Chip
                label={timeLeft(new Date(agenda.start), new Date(agenda.end))}
              />
            )}
          </>
        )}
      </Box>

      {agenda?.description && (
        <Typography variant="body" sx={{ display: "block", p: 2 }}>
          {agenda.description}
        </Typography>
      )}

      <Divider />
    </>
  );
}
