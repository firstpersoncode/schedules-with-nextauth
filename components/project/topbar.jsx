import { AccountCircle, Close, Menu } from "@mui/icons-material";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useSessionContext } from "context/session";

export default function TopBar({ open, onOpen, onClose }) {
  const { user } = useSessionContext();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2, display: { xs: "block", lg: "none" } }}
          onClick={open ? onClose : onOpen}
        >
          {open ? <Close /> : <Menu />}
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome
        </Typography>
        <Tooltip title="Profile">
          <IconButton>
            {user.image ? (
              <Avatar alt="Profile" src={user.image} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
