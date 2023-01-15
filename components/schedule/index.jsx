import {
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  Close,
  Inbox,
  Mail,
  Menu,
} from "@mui/icons-material";
import {
  SwipeableDrawer,
  Box,
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  Avatar,
  Alert,
  AlertTitle,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import Countdown from "components/countdown";
import { useSessionContext } from "context/session";
import { useState } from "react";
import getDayName from "utils/getDayName";

const drawerWidth = 400;
function SideBar({ open, onClose, onOpen, children }) {
  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        sx={{
          display: { xs: "block", lg: "none" },
          width: "90%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "90%",
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ textAlign: "right", p: 2 }}>
          <IconButton onClick={onClose}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ overflow: "auto" }}>{children}</Box>
      </SwipeableDrawer>
      <Drawer
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>FUCEK</Box>
        <Divider />
        <Box sx={{ overflow: "auto" }}>{children}</Box>
      </Drawer>
    </>
  );
}

function TopBar({ name, open, onOpen, onClose }) {
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
          {name}
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

export default function Schedule() {
  const [openDrawer, setOpenDrawer] = useState(false);
  function handleOpenDrawer() {
    setOpenDrawer(true);
  }
  function handleCloseDrawer() {
    setOpenDrawer(false);
  }

  return (
    <>
      <TopBar
        name="Default"
        open={openDrawer}
        onOpen={handleOpenDrawer}
        onClose={handleCloseDrawer}
      />
      <Box sx={{ display: "flex" }}>
        <SideBar
          open={openDrawer}
          onOpen={handleOpenDrawer}
          onClose={handleCloseDrawer}
        >
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <Inbox /> : <Mail />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </SideBar>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />

          <Box
            sx={{
              display: "grid",
              grid: {
                xs: "auto / auto",
                lg: "auto / repeat(2, 1fr)",
              },
              gap: 2,
              my: 2,
            }}
          >
            <Alert severity="success">
              <AlertTitle sx={{ fontSize: { xs: "16px", lg: "20px" } }}>
                In Progress
              </AlertTitle>
              <Typography
                sx={{ fontSize: { xs: "26px", lg: "30px", fontWeight: "500" } }}
              >
                Task title
              </Typography>
            </Alert>

            <Alert severity="warning">
              <AlertTitle sx={{ fontSize: { xs: "16px", lg: "20px" } }}>
                Incoming on {getDayName("2023-01-16T12:02:50")} |{" "}
                <Countdown targetDate={"2023-01-16T12:02:50"} /> left
              </AlertTitle>
              <Typography
                sx={{ fontSize: { xs: "26px", lg: "30px", fontWeight: "500" } }}
              >
                Task title
              </Typography>
            </Alert>
          </Box>

          <Box
            sx={{
              display: "grid",
              grid: {
                xs: "repeat(2, 1fr) / repeat(2, 1fr)",
                lg: "auto / repeat(3, 1fr)",
              },
              gap: 2,
              my: 2,
            }}
          >
            <Alert severity="info" sx={{ flex: 1 }}>
              <AlertTitle sx={{ fontSize: { xs: "12px", lg: "14px" } }}>
                {getDayName("2023-01-16T12:02:50")} |{" "}
                <Countdown targetDate={"2023-01-16T12:02:50"} /> left
              </AlertTitle>
              <Typography
                sx={{ fontSize: { xs: "14px", lg: "16px", fontWeight: "500" } }}
              >
                Task title
              </Typography>
            </Alert>
            <Alert severity="info" sx={{ flex: 1 }}>
              <AlertTitle sx={{ fontSize: { xs: "12px", lg: "14px" } }}>
                {getDayName("2023-01-16T12:02:50")} |{" "}
                <Countdown targetDate={"2023-01-16T12:02:50"} /> left
              </AlertTitle>
              <Typography
                sx={{ fontSize: { xs: "14px", lg: "16px", fontWeight: "500" } }}
              >
                Task title
              </Typography>
            </Alert>
            <Alert severity="info" sx={{ flex: 1 }}>
              <AlertTitle sx={{ fontSize: { xs: "12px", lg: "14px" } }}>
                {getDayName("2023-01-16T12:02:50")} |{" "}
                <Countdown targetDate={"2023-01-16T12:02:50"} /> left
              </AlertTitle>
              <Typography
                sx={{ fontSize: { xs: "14px", lg: "16px", fontWeight: "500" } }}
              >
                Task title
              </Typography>
            </Alert>
          </Box>

          <Divider sx={{ my: 4 }}>Performance</Divider>

          <Box sx={{ display: "flex", gap: 2, my: 2 }}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Completed
                </Typography>
                <Typography sx={{ fontSize: "45px" }}>10</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Remaining
                </Typography>
                <Typography sx={{ fontSize: "45px" }}>10</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}
