import { useMemo, useState } from "react";
import { Edit, ExpandLess, ExpandMore, Task } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Collapse,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { useAgendaContext } from "context/agenda";
import formatDateRange from "utils/formatDateRange";

export default function Agenda({ agenda }) {
  const {
    // agenda: activeAgenda,
    // selectAgenda,
    toggleCheckedAgenda,
    openAgendaDialog,
    openEventDialog,
    getLabelsByAgenda,
    toggleCheckedLabel,
  } = useAgendaContext();
  const labels = getLabelsByAgenda(agenda);
  const [open, setOpen] = useState(true);

  function toggleOpen() {
    setOpen(!open);
  }

  // function handleSelectAgenda() {
  //   selectAgenda(agenda);
  // }

  function handleCheckedAgenda(_, checked) {
    toggleCheckedAgenda(agenda, checked);
  }

  function handleClickEditAgenda() {
    openAgendaDialog(agenda);
  }

  function handleOpenEventDialog() {
    openEventDialog(null, null, agenda);
  }

  function handleCheckedLabel(label) {
    return function (_, checked) {
      toggleCheckedLabel(label, checked, agenda);
    };
  }

  const startEndAgenda = useMemo(() => {
    return formatDateRange(agenda.start, agenda.end);
  }, [agenda]);

  const expanded = open && agenda.checked;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
        }}
      >
        <FormControlLabel
          sx={{ flex: 1 }}
          onChange={handleCheckedAgenda}
          control={
            <Checkbox
              sx={{
                color: agenda.color,
                "&.Mui-checked": {
                  color: agenda.color,
                },
              }}
              checked={agenda.checked}
            />
          }
          label={agenda.title}
        />

        {/* <FormControlLabel
          sx={{ flex: 1 }}
          onChange={handleSelectAgenda}
          control={
            <Radio
              sx={{
                color: agenda.color,
                "&.Mui-checked": {
                  color: agenda.color,
                },
              }}
              checked={activeAgenda?.id === agenda.id}
            />
          }
          label={agenda.title}
        /> */}

        <IconButton onClick={toggleOpen} size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        {labels.length > 0 && (
          <Box sx={{ p: 2 }}>
            <FormGroup>
              {labels.map((label, i) => (
                <FormControlLabel
                  key={i}
                  onChange={handleCheckedLabel(label)}
                  control={
                    <Checkbox
                      sx={{
                        color: agenda.color,
                        "&.Mui-checked": {
                          color: agenda.color,
                        },
                      }}
                      checked={label.checked}
                    />
                  }
                  label={
                    <Chip
                      size="small"
                      sx={{
                        backgroundColor: label.color,
                      }}
                      label={label.title}
                    />
                  }
                />
              ))}
            </FormGroup>
          </Box>
        )}

        <Box
          sx={{
            px: 2,
            my: 1,
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              flex: 1,
              justifySelf: "flex-start",
            }}
          >
            {startEndAgenda}
          </Typography>

          <Tooltip title="Edit">
            <IconButton onClick={handleClickEditAgenda} size="small">
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add event">
            <IconButton size="small" onClick={handleOpenEventDialog}>
              <Task />
            </IconButton>
          </Tooltip>
        </Box>
      </Collapse>
      <Divider />
    </>
  );
}
