import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Close,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  MoreVert,
} from "@mui/icons-material";
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
  Switch,
  Popover,
  List,
  ListItemButton,
  DialogActions,
  Button,
} from "@mui/material";
import { useAgendaContext } from "context/agenda";
import formatDateRange from "utils/formatDateRange";
import { useDialog } from "components/dialog";
const Dialog = dynamic(() => import("components/dialog"));

export default function Agenda({ agenda }) {
  const {
    toggleCheckedAgenda,
    getLabelsByAgenda,
    toggleCheckedLabel,
    getStatusesByAgenda,
    toggleCollapsedAgenda,
    toggleCheckedStatus,
    openAgendaDialog,
    unSelectAgendaOption,
    deleteAgenda,
    deleteEventsByAgenda,
  } = useAgendaContext();

  const labels = getLabelsByAgenda(agenda);
  const statuses = getStatusesByAgenda(agenda);
  const [anchorEl, setAnchorEl] = useState(null);

  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  function toggleOpen() {
    toggleCollapsedAgenda(agenda, !agenda.collapsed);
  }

  function toggleMore(e) {
    if (!anchorEl) setAnchorEl(e.currentTarget);
    else setAnchorEl(null);
  }

  const more = Boolean(anchorEl);

  function handleCheckedAgenda(_, checked) {
    toggleCheckedAgenda(agenda, checked);
  }

  function handleClickEditAgenda() {
    openAgendaDialog(agenda);
    toggleMore();
  }

  function handleUnSelectAgenda() {
    unSelectAgendaOption(agenda);
  }

  async function handleDelete(e) {
    e.preventDefault();

    handleOpenDialog(
      `<strong>You're about to delete ${agenda.title}</strong> including all the associated events with this agenda.<p>This action can't be undone once deleting complete</p>`,
      "warning"
    );
  }

  async function confirmDelete(e) {
    e.preventDefault();

    try {
      await deleteAgenda(agenda);
      deleteEventsByAgenda(agenda);
      handleCloseDialog();
    } catch (err) {}
  }

  function handleCheckedLabel(label) {
    return function (_, checked) {
      toggleCheckedLabel(label, checked, agenda);
    };
  }

  function handleCheckedStatus(status) {
    return function (_, checked) {
      toggleCheckedStatus(status, checked, agenda);
    };
  }

  const startEndAgenda = useMemo(() => {
    return formatDateRange(agenda.start, agenda.end);
  }, [agenda]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
        }}
      >
        <Typography onClick={toggleOpen} sx={{ flex: 1, cursor: "pointer" }}>
          {agenda.title}
        </Typography>
        <Tooltip title="Collapse">
          <IconButton onClick={toggleOpen} size="small">
            {!agenda.collapsed ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove">
          <IconButton size="small" onClick={handleUnSelectAgenda}>
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="More">
          <IconButton onClick={toggleMore} size="small">
            <MoreVert sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

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
          <ListItemButton onClick={handleClickEditAgenda}>
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

      <Collapse in={!agenda.collapsed}>
        <Box
          sx={{
            px: 2,
            my: 1,
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
            }}
          >
            {startEndAgenda}
          </Typography>

          <Tooltip title="Display">
            <FormControlLabel
              sx={{
                "& .MuiButtonBase-root.Mui-checked": {
                  color: agenda.color,
                },
                "& .MuiButtonBase-root.Mui-checked+.MuiSwitch-track": {
                  backgroundColor: agenda.color,
                },
              }}
              onChange={handleCheckedAgenda}
              control={<Switch checked={agenda.checked} />}
            />
          </Tooltip>
        </Box>

        <Divider textAlign="left" sx={{ fontSize: 12 }}>
          Statuses
        </Divider>
        {statuses.length > 0 && (
          <Box sx={{ p: 2 }}>
            <FormGroup>
              {statuses.map((status, i) => (
                <FormControlLabel
                  key={i}
                  onChange={handleCheckedStatus(status)}
                  control={
                    <Checkbox
                      sx={{
                        color: agenda.color,
                        "&.Mui-checked": {
                          color: agenda.color,
                        },
                      }}
                      checked={status.checked}
                    />
                  }
                  label={status.title}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        <Divider textAlign="left" sx={{ fontSize: 12 }}>
          Labels
        </Divider>
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
      </Collapse>
      {/* <Box sx={{ height: 2, backgroundColor: agenda.color }} /> */}
      <Divider />

      {dialog && (
        <Dialog dialog={dialog} onClose={handleCloseDialog}>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
