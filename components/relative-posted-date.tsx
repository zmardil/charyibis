"use client";

import { useEffect, useState } from "react";

function getRelativeDate(value: string) {
    const postedDate = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(postedDate.getTime())) return "Date unavailable";

    const now = new Date();
    const postedDay = Date.UTC(
        postedDate.getUTCFullYear(),
        postedDate.getUTCMonth(),
        postedDate.getUTCDate(),
    );
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const daysAgo = Math.floor((today - postedDay) / 86_400_000);
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "always" });

    if (daysAgo < 1) return formatter.format(0, "day");
    if (daysAgo < 30) return formatter.format(-daysAgo, "day");

    const monthsAgo =
        (now.getFullYear() - postedDate.getUTCFullYear()) * 12 +
        now.getMonth() -
        postedDate.getUTCMonth();
    if (monthsAgo < 12) return formatter.format(-monthsAgo, "month");

    const yearsAgo = Math.floor(monthsAgo / 12);
    return formatter.format(-yearsAgo, "year");
}

export function RelativePostedDate({ date }: { date?: string }) {
    const [relativeDate, setRelativeDate] = useState("Date unavailable");

    useEffect(() => {
        if (date) setRelativeDate(getRelativeDate(date));
    }, [date]);

    return <>{relativeDate}</>;
}