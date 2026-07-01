const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

export const fetchNotificationsAPI = async (page = 1, limit = 10, type = '') => {
  const url = new URL(API_URL);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);
  if (type && type !== 'All') url.searchParams.append('notification_type', type);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to fetch notifications${errorText ? `: ${errorText}` : ''}`);
  }

  return response.json();
};