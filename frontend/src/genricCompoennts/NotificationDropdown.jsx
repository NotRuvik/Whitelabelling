import React from "react";
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import SettingsIcon from "@mui/icons-material/Settings";

const NotificationDropdown = ({
  anchorEl,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onClearOne,
  onClickNotification,
  onClickNotificationIcon,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={(e) => {
            if (typeof onClickNotificationIcon === "function") {
              onClickNotificationIcon(e);
            }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <CircleNotificationsIcon sx={{ fontSize: 30 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 520,
            // mt: 1.5,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 3,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={600}>Notifications</Typography>
          <IconButton size="small" sx={{ color: "white" }}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Notification list */}
        <Box sx={{ maxHeight: 400, overflowY: "auto", bgcolor: "#fff" }}>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <Box
                key={n._id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                }}
                onClick={() => {
                  onClose();
                  onClickNotification(n);
                }}
              >
                <Avatar
                  src={n.avatar || ""}
                  sx={{ width: 40, height: 40 }}
                  alt="avatar"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: n.isRead ? 400 : 600,
                      color: n.isRead ? "text.secondary" : "text.primary",
                    }}
                  >
                    {n.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {n.time || "Just now"}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  {!n.isRead && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                      }}
                    />
                  )}
                  <Tooltip title="Dismiss">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearOne(n._id);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              sx={{ p: 4, textAlign: "center" }}
              color="text.secondary"
            >
              🎉 You're all caught up!
            </Typography>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #eee",
          }}
        >
          <Stack direction="row" spacing={1}>
            <Tooltip title="Mark all as read">
              <IconButton onClick={onMarkAllRead} color="success">
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear all notifications">
              <IconButton onClick={onClearAll} color="error">
                <DeleteSweepIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Button
            variant="text"
            size="small"
            sx={{ color: "primary.main", fontWeight: 500 }}
            onClick={() => {
              onClose();
              // Optionally redirect
            }}
          >
            See all recent activity
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationDropdown;
