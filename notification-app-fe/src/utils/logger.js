const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;
const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

export const logEvent = async ({
  stack = "frontend",
  level = "info",
  pkg = "app",
  message = "",
}) => {
  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    if (!response.ok) {
      const serverText = await response.text().catch(() => "");
      if (import.meta.env.DEV) {
        console.error("Logging failed:", response.status, serverText);
      }
      return;
    }

    if (import.meta.env.DEV) {
      const serverText = await response.text().catch(() => "");
      console.log("Logging response:", response.status, serverText);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Logging Error:", error);
    }
  }
};