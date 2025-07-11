// utils/SLAClock.js
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Asia/Kolkata';

function SLAClock(start, end, serviceWindow, slaTimeline = [], holidays = []) {
  const startDate = dayjs(start).tz(TIMEZONE);
  const endDate = dayjs(end).tz(TIMEZONE);

  if (serviceWindow) {
    return endDate.diff(startDate, 'minute');
  }

  let duration = 0;
  let current = startDate;
  const forward = endDate.isAfter(startDate);
  const step = forward ? 1 : -1;

  while ((forward && current.isBefore(endDate)) || (!forward && current.isAfter(endDate))) {
    const dayStr = current.format('YYYY-MM-DD');
    const weekday = current.format('dddd');

    if (['Saturday', 'Sunday'].includes(weekday)) {
      current = current.add(step, 'day').startOf('day');
      continue;
    }

    if (holidays.includes(dayStr)) {
      current = current.add(step, 'day').startOf('day');
      continue;
    }

    const slaDay = slaTimeline.find(t => t.weekDay === weekday);
    if (slaDay) {
      const workStart = dayjs(`${dayStr}T${dayjs(slaDay.startTime).tz(TIMEZONE).format('HH:mm')}`).tz(TIMEZONE);
      const workEnd = dayjs(`${dayStr}T${dayjs(slaDay.endTime).tz(TIMEZONE).format('HH:mm')}`).tz(TIMEZONE);

      const overlapStart = forward ? (workStart.isAfter(current) ? workStart : current) : (workEnd.isBefore(current) ? workEnd : current);
      const overlapEnd = forward ? (workEnd.isBefore(endDate) ? workEnd : endDate) : (workStart.isAfter(endDate) ? workStart : endDate);

      if (overlapEnd.isAfter(overlapStart)) {
        const diffMinutes = overlapEnd.diff(overlapStart, 'minute');
        duration += step * diffMinutes;
      }
    }

    current = current.add(step, 'day').startOf('day');
  }

  return duration;
}

export default SLAClock;
