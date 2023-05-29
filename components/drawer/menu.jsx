import { useState, useEffect } from "react";
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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useCommonContext } from "context/common";
import { useAgendaContext } from "context/agenda";
import Agenda from "./agenda";

function Agendas({ agendas }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable droppableId="agendas">
      {(provided) => (
        <Box ref={provided.innerRef} {...provided.droppableProps}>
          {agendas.map((agenda, i) => (
            <Draggable key={agenda.id} draggableId={agenda.id} index={i}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  draggable
                  sx={{ backgroundColor: "#FFF" }}
                >
                  <Agenda agenda={agenda} />
                </Box>
              )}
            </Draggable>
          ))}
        </Box>
      )}
    </Droppable>
  );
}

export default function Menu() {
  const { asPath } = useRouter();
  const { isLoading, openAgendaDialog } = useCommonContext();
  const { setAgendas, agendas, agendaOptions, selectAgendaOption } =
    useAgendaContext();

  const [inputValue, setInputValue] = useState("");

  function handleInputChange(e) {
    setInputValue(e?.target?.value || "");
  }

  function handleSelectAgenda(_, agenda) {
    selectAgendaOption(agenda);
    setInputValue("");
  }

  function onDragEnd(res) {
    if (!res.destination) return;
    const sortedAgendas = [...agendas];
    const agenda = sortedAgendas.find((a) => a.id === res.draggableId);
    sortedAgendas.splice(res.source.index, 1);
    sortedAgendas.splice(res.destination.index, 0, agenda);
    setAgendas(sortedAgendas);
  }

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <List sx={{ m: 0, p: 0 }}>
        <Link href="/board">
          <ListItemButton selected={asPath === "/board"}>
            <ListItemIcon>
              <TableChart />
            </ListItemIcon>
            <ListItemText sx={{ color: "#666" }} primary="Board" />
          </ListItemButton>
        </Link>

        <Link href="/">
          <ListItemButton selected={asPath === "/"}>
            <ListItemIcon>
              <CalendarMonth />
            </ListItemIcon>
            <ListItemText sx={{ color: "#666" }} primary="Calendar" />
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
          sx={{ mb: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Agenda"
              variant="outlined"
            />
          )}
        />

        <Tooltip title="Create Agenda">
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Agendas agendas={agendas} />
      </DragDropContext>
    </Box>
  );
}
