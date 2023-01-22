import { useMemo, useState } from "react";
import { Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Collapse,
  Radio,
  Typography,
  Chip,
} from "@mui/material";
import { useAgendaContext } from "context/agenda";
import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";

export default function Agenda({ agenda }) {
  const {
    agenda: activeAgenda,
    selectAgenda,
    openAgendaDialog,
    getLabelsByAgenda,
    toggleCheckedLabel,
  } = useAgendaContext();
  const labels = getLabelsByAgenda(agenda);
  const [open, setOpen] = useState(true);

  function toggleOpen() {
    setOpen(!open);
  }

  function handleSelectAgenda() {
    selectAgenda(agenda);
  }

  function handleClickEditAgenda() {
    openAgendaDialog(agenda);
  }

  function handleCheckedLabel(label) {
    return function (_, checked) {
      toggleCheckedLabel(label, checked);
    };
  }

  const startEndAgenda = useMemo(() => {
    if (!agenda.end) return format(new Date(agenda.start), "iii dd MMM, yyyy");
    if (isSameDay(new Date(agenda.start), new Date(agenda.end)))
      return `${format(new Date(agenda.start), "iii dd MMM HH:mm")} - ${format(
        new Date(agenda.end),
        "HH:mm, yyyy"
      )}`;
    let res = "";
    if (isSameMonth(new Date(agenda.start), new Date(agenda.end)))
      res = `${format(new Date(agenda.start), "iii dd")} - ${format(
        new Date(agenda.end),
        "iii dd MMM, yyyy"
      )}`;
    else {
      if (isSameYear(new Date(agenda.start), new Date(agenda.end)))
        res = `${format(new Date(agenda.start), "iii dd MMM")} - ${format(
          new Date(agenda.end),
          "iii dd MMM, yyyy"
        )}`;
      else
        res = `${format(new Date(agenda.start), "iii dd MMM, yyyy")} - ${format(
          new Date(agenda.end),
          "iii dd MMM, yyyy"
        )}`;
    }

    return res;
  }, [agenda]);

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

        <IconButton onClick={handleClickEditAgenda} size="small">
          <Edit />
        </IconButton>

        <IconButton onClick={toggleOpen} size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        {labels.length > 0 && (
          <Box sx={{ px: 2 }}>
            <FormGroup>
              {labels.map((label, i) => (
                <FormControlLabel
                  key={i}
                  onChange={handleCheckedLabel(label)}
                  control={
                    <Checkbox
                      sx={{
                        color: agenda.eventColor,
                        "&.Mui-checked": {
                          color: agenda.eventColor,
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

        <Typography sx={{ p: 2, fontSize: 12 }}>{startEndAgenda}</Typography>
      </Collapse>
      <Divider />
    </>
  );
}
