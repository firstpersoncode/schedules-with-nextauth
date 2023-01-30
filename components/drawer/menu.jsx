import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Divider,
  Button,
  Autocomplete,
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  LinearProgress,
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
  const { agendas, agendaOptions, selectAgendaOption } = useAgendaContext();

  const [inputValue, setInputValue] = useState("");
  function handleInputChange(e) {
    setInputValue(e?.target?.value || "");
  }
  function handleSelectAgenda(_, agenda) {
    selectAgendaOption(agenda);
    setInputValue("");
  }

  return (
    <Box sx={{ overflowY: "auto" }}>
      <List sx={{ m: 0, p: 0 }}>
        <Link href="/calendar">
          <ListItemButton selected={asPath === "/calendar"}>
            <ListItemIcon>
              <CalendarMonth />
            </ListItemIcon>
            <ListItemText sx={{ color: "#666" }} primary="Calendar" />
          </ListItemButton>
        </Link>
        <Link href="/board">
          <ListItemButton selected={asPath === "/board"}>
            <ListItemIcon>
              <TableChart />
            </ListItemIcon>
            <ListItemText sx={{ color: "#666" }} primary="Board" />
          </ListItemButton>
        </Link>
        <Link href="/report">
          <ListItemButton selected={asPath === "/report"}>
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText sx={{ color: "#666" }} primary="Report" />
          </ListItemButton>
        </Link>
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Tooltip title="Add agenda">
          <Button
            variant="contained"
            fullWidth
            startIcon={<Add />}
            onClick={openAgendaDialog}
          >
            Agenda
          </Button>
        </Tooltip>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        {isLoading && <LinearProgress />}
        <Autocomplete
          options={agendaOptions}
          getOptionLabel={(o) => o?.title || ""}
          onChange={handleSelectAgenda}
          onInputChange={handleInputChange}
          disableClearable
          blurOnSelect
          fullWidth
          value={null}
          inputValue={inputValue}
          renderInput={(params) => (
            <TextField {...params} label="Agenda" variant="outlined" />
          )}
        />
      </Box>

      <Divider />

      {agendas.map((agenda, i) => (
        <Agenda key={i} agenda={agenda} />
      ))}
    </Box>
  );
}
