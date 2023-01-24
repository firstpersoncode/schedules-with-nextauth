import {
  Box,
  Divider,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Skeleton,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAgendaContext } from "context/agenda";
import Agenda from "./agenda";

export default function Menu() {
  const {
    isLoading,
    agendas,
    openAgendaDialog,
    statuses,
    toggleEventStatuses,
  } = useAgendaContext();

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

      {isLoading && !agendas.length && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1,
            }}
          >
            <Skeleton animation="wave" height="40px" width="7%" />
            <Skeleton animation="wave" height="40px" width="93%" />
          </Box>
          <Skeleton animation="wave" height="40px" width="50%" />
        </Box>
      )}

      {agendas.map((agenda, i) => (
        <Agenda key={i} agenda={agenda} />
      ))}

      {isLoading && !agendas.length && (
        <Box sx={{ p: 2 }}>
          <Skeleton animation="wave" height="40px" width="50%" />
          <Skeleton animation="wave" height="40px" width="50%" />
          <Skeleton animation="wave" height="40px" width="50%" />
        </Box>
      )}

      {agendas.length > 0 && (
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
      )}
    </Box>
  );
}
