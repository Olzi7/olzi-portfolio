import { useEffect, useState } from "react";

export function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
