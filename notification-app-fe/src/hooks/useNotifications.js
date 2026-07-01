import { useState, useEffect } from 'react';
import { fetchNotificationsAPI } from '../api/notifications';
import { logEvent } from '../utils/logger';

const PRIORITY_MAP = { 'Placement': 1, 'Result': 2, 'Event': 3 };

export const useNotifications = (page, limit, filterType) => {
  const [notifications, setNotifications] = useState([]);
  const [topTen, setTopTen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const mapNotification = (notification = {}) => ({
      id: notification.ID ?? notification.id ?? '',
      type: notification.Type ?? notification.type ?? '',
      message: notification.Message ?? notification.message ?? '',
      timestamp: notification.Timestamp ?? notification.timestamp ?? '',
    });

    const loadData = async () => {
      setLoading(true);
      logEvent({ stack: 'frontend', level: 'info', pkg: 'api', message: `API request started: page ${page}` });

      try {
        const data = await fetchNotificationsAPI(page, limit, filterType);
        const apiNotifications = Array.isArray(data?.notifications) ? data.notifications : [];
        const mappedNotifications = apiNotifications.map(mapNotification);

        if (isMounted) {
          logEvent({ stack: 'frontend', level: 'info', pkg: 'api', message: 'API success' });

          const sortedNotifications = [...mappedNotifications].sort((a, b) => {
            const pA = PRIORITY_MAP[a.type] || 99;
            const pB = PRIORITY_MAP[b.type] || 99;
            return pA - pB;
          });

          setNotifications(mappedNotifications);
          setTopTen(sortedNotifications.slice(0, 10));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          logEvent({ stack: 'frontend', level: 'error', pkg: 'api', message: `API failure: ${err.message}` });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, [page, limit, filterType]);

  return { notifications, topTen, loading, error };
};