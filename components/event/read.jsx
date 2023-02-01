import { useMemo, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Popover,
  List,
  ListItemButton,
} from "@mui/material";
import { Delete, MoreVert, Edit, Close } from "@mui/icons-material";
import updateEventScheduleByStatus from "utils/updateEventScheduleByStatus";
import { useAgendaContext } from "context/agenda";
import { repeatOptions } from "context/agenda/controller/event";
import formatDateRange from "utils/formatDateRange";

export default function Read({
  loading,
  agenda,
  event,
  onClose,
  onDelete,
  toggleLoading,
  toggleWrite,
}) {
  const { getStatusesByAgenda, addEvent, updateEvent, cancelEvent } =
    useAgendaContext();

  const [anchorEl, setAnchorEl] = useState(null);

  function toggleMore(e) {
    if (!anchorEl) setAnchorEl(e.currentTarget);
    else setAnchorEl(null);
  }

  const more = Boolean(anchorEl);

  const statuses = useMemo(() => {
    return getStatusesByAgenda(agenda);
  }, [agenda, getStatusesByAgenda]);

  async function handleDelete(e) {
    e.preventDefault();
    onDelete();
  }

  async function handleSelectStatus(_, status) {
    const updatedSchedule = updateEventScheduleByStatus(event, status);
    toggleLoading();
    try {
      if (event.repeat) {
        event.cancelledAt.push(new Date(event.start));
        await cancelEvent({
          id: event.id,
          cancelledAt: event.cancelledAt,
        });

        await addEvent({
          title: event.title,
          description: event.description,
          labels: event.labels,
          agenda,
          status,
          ...updatedSchedule,
          cancelledAt: [],
        });
      } else {
        await updateEvent({
          ...event,
          ...updatedSchedule,
          status,
        });
      }
    } catch (err) {
      console.error(err);
    }
    toggleLoading();
  }

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Autocomplete
          required
          value={event.status}
          options={statuses}
          getOptionLabel={(o) => o.title}
          onChange={handleSelectStatus}
          disableClearable
          blurOnSelect
          sx={{ width: "50%" }}
          size="small"
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        />

        <Box>
          <Tooltip title="More">
            <IconButton onClick={toggleMore} size="small">
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton disabled={loading} onClick={onClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography sx={{ mb: 2, fontSize: 14, color: "text.secondary" }}>
        {agenda.title}
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 20 }}>{event.title}</Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {formatDateRange(event.start, event.end)}
        </Typography>
        -
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {repeatOptions.find((r) => r.value === event.repeat)?.title ||
            "One Time"}
        </Typography>
      </Box>

      {event.description && (
        <Typography sx={{ mb: 2 }}>{event.description}</Typography>
      )}
      {event.labels.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          {event.labels.map((label, i) => (
            <Chip
              key={i}
              label={label.title}
              sx={{
                backgroundColor: label.color,
              }}
            />
          ))}
        </Box>
      )}

      <Popover
        open={more}
        anchorEl={anchorEl}
        onClose={toggleMore}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          <ListItemButton onClick={toggleWrite}>
            <Tooltip placement="left" title="Edit">
              <Edit />
            </Tooltip>
          </ListItemButton>
          <ListItemButton onClick={handleDelete}>
            <Tooltip placement="left" title="Delete">
              <Delete />
            </Tooltip>
          </ListItemButton>
        </List>
      </Popover>
    </>
  );
}
