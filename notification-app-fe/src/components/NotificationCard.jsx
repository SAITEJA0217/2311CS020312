import { useState } from "react";
import { Card, CardContent, Typography, Chip, Box, IconButton, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { logEvent } from "../utils/logger";

export default function NotificationCard({ notification, isPriorityView }) {
  // Phase 7: Viewed/Unviewed state management
  const [viewed, setViewed] = useState(false);

  // Dynamic styling based on priority
  const getPriorityColor = (type) => {
    switch (type) {
      case "Placement": return "error";    // Red (High Priority)
      case "Result": return "warning";     // Orange (Medium Priority)
      case "Event": return "info";         // Blue (Low Priority)
      default: return "secondary";
    }
  };

  const handleMarkAsViewed = () => {
    if (!viewed) {
      setViewed(true);
      // Phase 8: Log when a notification is viewed
      logEvent({
        stack: "frontend",
        level: "info",
        pkg: "ui",
        message: `Notification viewed: ID ${notification.id}`
      });
    }
  };

  return (
    <Card
      sx={{
        mb: 1.5,
        // Visual indicator: gray border if viewed, colored border if unviewed
        borderLeft: viewed 
          ? "4px solid #e0e0e0" 
          : `4px solid var(--mui-palette-${getPriorityColor(notification.type)}-main)`,
        opacity: viewed ? 0.6 : 1, // Dim the card if it's been read
        transition: "all 0.2s ease-in-out",
        boxShadow: viewed ? 0 : 1,
        "&:hover": { boxShadow: 3 }
      }}
    >
      <CardContent sx={{ pb: "16px !important" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          
          <Box flex={1}>
            <Stack direction="row" spacing={1} mb={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={notification.type || 'Unknown'}
                size="small"
                color={getPriorityColor(notification.type)}
                variant={viewed ? 'outlined' : 'filled'}
              />
              {isPriorityView && (
                <Chip label="Top 10" size="small" color="secondary" variant="outlined" />
              )}
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {notification.timestamp || 'No timestamp'}
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
              {notification.message}
            </Typography>
          </Box>

          <Box>
            <IconButton
              onClick={handleMarkAsViewed}
              color={viewed ? "default" : "primary"}
              aria-label="mark as viewed"
              disabled={viewed}
            >
              {viewed ? <CheckCircleIcon color="disabled" /> : <CheckCircleOutlinedIcon />}
            </IconButton>
          </Box>

        </Stack>
      </CardContent>
    </Card>
  );
}