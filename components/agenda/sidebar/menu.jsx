import {
  Box,
  Divider,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAgendaContext } from "context/agenda";
import Agenda from "./agenda";

export default function Menu() {
  const { agendas, openAgendaDialog, statuses, toggleEventStatuses } =
    useAgendaContext();

  function handleCreateAgenda() {
    openAgendaDialog(null);
  }

  function handleCheckedStatus(status) {
    return function (_, checked) {
      toggleEventStatuses(status, checked);
    };
  }

  return (
    <Box sx={{ overflowY: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
        <Button
          startIcon={<Add />}
          variant="contained"
          fullWidth
          onClick={openAgendaDialog}
        >
          Agenda
        </Button>
      </Box>

      <Divider />

      {agendas.map((agenda, i) => (
        <Agenda key={i} agenda={agenda} />
      ))}

      <Box sx={{ p: 2 }}>
        <FormGroup>
          {statuses.map((status, i) => (
            <FormControlLabel
              key={i}
              onChange={handleCheckedStatus(status)}
              control={<Checkbox checked={status.checked} />}
              label={status.title}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}
