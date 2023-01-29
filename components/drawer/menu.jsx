import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Divider,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Skeleton,
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Assessment,
  CalendarMonth,
  TableChart,
} from "@mui/icons-material";
import { useCommonContext } from "context/common";
import { useAgendaContext } from "context/agenda";
import Agenda from "./agenda";

export default function Menu() {
  const { asPath } = useRouter();
  const { isLoading, openAgendaDialog } = useCommonContext();
  const { agendas, statuses, toggleEventStatuses } = useAgendaContext();

  function handleCheckedStatus(status) {
    return function (_, checked) {
      toggleEventStatuses(status, checked);
    };
  }

  return (
    <Box sx={{ overflowY: "auto" }}>
      <Tooltip title="Add agenda">
        <Button
          variant="contained"
          sx={{ borderRadius: 0, justifyContent: "flex-start" }}
          fullWidth
          startIcon={<Add />}
          onClick={openAgendaDialog}
        >
          Agenda
        </Button>
      </Tooltip>

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

      <Divider />

      <List>
        <Link href="/calendar">
          <ListItemButton selected={asPath === "/calendar"}>
            <ListItemIcon>
              <CalendarMonth />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItemButton>
        </Link>
        <Link href="/board">
          <ListItemButton selected={asPath === "/board"}>
            <ListItemIcon>
              <TableChart />
            </ListItemIcon>
            <ListItemText primary="Board" />
          </ListItemButton>
        </Link>
        <Link href="/report">
          <ListItemButton selected={asPath === "/report"}>
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItemButton>
        </Link>
      </List>
    </Box>
  );
}
