import { useEffect, useState } from "react";

const KEY = "ac.snowfall";

export function useSnowfall() {
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "0") setEnabled(false);
    } catch {}
  }, []);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  return { enabled, toggle };
}
