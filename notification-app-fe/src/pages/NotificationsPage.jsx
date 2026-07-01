import { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import NotificationCard from "../components/NotificationCard";
import NotificationFilter from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { logEvent } from "../utils/logger";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { notifications, topTen, loading, error } = useNotifications(page, limit, filter);

  // Fallback for totalPages if your API doesn't return it yet
  const totalPages = 10; 
  const unreadCount = notifications ? notifications.length : 0;

  // 3. Page Load Logging
  useEffect(() => {
    logEvent({ stack: 'frontend', level: 'info', pkg: 'ui', message: 'Notifications Page opened' });
  }, []);

  const handleFilterChange = (_, newFilter) => {
    const selectedFilter = newFilter || 'All';
    setFilter(selectedFilter);
    setPage(1);
    logEvent({ stack: 'frontend', level: 'info', pkg: 'ui', message: `Filter changed to: ${selectedFilter}` });
  };

  // 5. Handle Pagination with Logging
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    logEvent({ stack: 'frontend', level: 'info', pkg: 'ui', message: `Pagination changed to page: ${newPage}` });
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {/* FIXED: Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {/* FIXED: Error State */}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to load notifications: {error}</Alert>
      )}

      {/* FIXED: Empty State */}
      {!loading && !error && notifications?.length === 0 && (
        <Alert severity="info">No notifications found for this filter.</Alert>
      )}

      {/* FIXED: Render Data & Top 10 Priority */}
      {!loading && !error && notifications?.length > 0 && (
        <Stack spacing={1.5}>
          {/* Phase 5/7 Requirement: Priority Top 10 */}
          {page === 1 && topTen?.length > 0 && filter === 'All' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                Priority Top 10
              </Typography>
              <Stack spacing={1.5}>
                {topTen.map((n) => (
                  <NotificationCard key={`top-${n.id}`} notification={n} isPriorityView={true} />
                ))}
              </Stack>
              <Divider sx={{ mt: 3 }} />
            </Box>
          )}

          {/* Regular Paginated Notifications */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            All Notifications
          </Typography>
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </Stack>
      )}

      {/* FIXED: Pagination */}
      {!loading && !error && notifications?.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}