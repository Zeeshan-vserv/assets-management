// SLAClock.jsx
import React, { useEffect, useState } from "react";

/**
 * @param {Object} props
 * @param {Date|string} props.incidentCreatedAt - ISO string or Date
 * @param {number} props.slaHours - SLA duration in hours
 * @param {boolean} props.is24x7 - true for 24x7, false for business hours
 * @param {Array} [props.slaTimeline] - Array of { weekDay, startTime, endTime } for business hours
 */
function SLAClock({ incidentCreatedAt, slaHours, is24x7, slaTimeline = [] }) {
  const [remaining, setRemaining] = useState(null);

  // Helper: get next business time slot
  function getNextBusinessSlot(date) {
    // Find the next slot in slaTimeline for the given date
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    const slots = slaTimeline.filter((slot) => slot.weekDay === dayName);
    if (!slots.length) return null;
    // Assume only one slot per day for simplicity
    const slot = slots[0];
    const start = new Date(date);
    const [startHour, startMin] = slot.startTime.split(":").map(Number);
    start.setHours(startHour, startMin, 0, 0);
    const end = new Date(date);
    const [endHour, endMin] = slot.endTime.split(":").map(Number);
    end.setHours(endHour, endMin, 0, 0);
    return { start, end };
  }

  // Helper: add business hours to a date, skipping non-business time
  function addBusinessHours(startDate, hoursToAdd) {
    let remaining = hoursToAdd * 60 * 60 * 1000; // ms
    let current = new Date(startDate);

    while (remaining > 0) {
      const slot = getNextBusinessSlot(current);
      if (!slot) {
        // Move to next day
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
        continue;
      }
      if (current < slot.start) current = new Date(slot.start);
      const timeInSlot = Math.max(0, slot.end - current);
      if (timeInSlot >= remaining) {
        current = new Date(current.getTime() + remaining);
        remaining = 0;
      } else {
        remaining -= timeInSlot;
        // Move to next day
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
      }
    }
    return current;
  }

  useEffect(() => {
    let deadline;
    if (is24x7) {
      deadline = new Date(incidentCreatedAt);
      deadline.setHours(deadline.getHours() + slaHours);
    } else {
      deadline = addBusinessHours(new Date(incidentCreatedAt), slaHours);
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;
      setRemaining(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [incidentCreatedAt, slaHours, is24x7, JSON.stringify(slaTimeline)]);

  // Format ms to HH:MM:SS
  const formatTime = (ms) => {
    if (ms === null) return "--:--:--";
    let totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <span>
        SLA Remaining:{" "}
        <span style={{ color: remaining === 0 ? "red" : "inherit" }}>
          {formatTime(remaining)}
        </span>
      </span>
    </div>
  );
}

export default SLAClock;