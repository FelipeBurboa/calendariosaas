"use client";

import { useState, useEffect } from "react";

interface DateFormatterProps {
  date: Date;
}

export function DateFormatter({ date }: DateFormatterProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formatted = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: userTimeZone,
    })
      .format(date)
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/de \w+$/, (m) =>
        m.replace(/\w+$/, (w) => w[0].toUpperCase() + w.slice(1))
      );
    setFormattedDate(formatted);
  }, [date]);

  return (
    <span className="text-sm font-medium text-muted-foreground">
      {formattedDate}
    </span>
  );
}
