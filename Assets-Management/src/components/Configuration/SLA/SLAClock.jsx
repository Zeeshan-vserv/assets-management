import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

/**
 * Calculate SLA time in hours.
 * @param {Date} start - The loggedInTime.
 * @param {Date} end - The SLA time.
 * @param {Boolean} serviceWindow - true for 24x7, false for business hours.
 * @param {Array} slaTimeline - business hours e.g. [{ weekDay: 'Monday', startTime, endTime }]
 * @returns SLA duration in hours (2 decimals)
 */
function SLAClock(start, end, serviceWindow, slaTimeline = []) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (serviceWindow) {
    return endDate.diff(startDate, 'hour', true).toFixed(2);
  } else {
    let duration = 0;
    let current = startDate;

    while (current.isBefore(endDate)) {
      const weekday = current.format('dddd');
      const slaDay = slaTimeline.find(t => t.weekDay === weekday);

      if (slaDay) {
        const workStart = dayjs(current.format('YYYY-MM-DD') + 'T' + dayjs(slaDay.startTime).format('HH:mm'));
        const workEnd = dayjs(current.format('YYYY-MM-DD') + 'T' + dayjs(slaDay.endTime).format('HH:mm'));

        const overlapStart = workStart.isAfter(current) ? workStart : current;
        const overlapEnd = workEnd.isBefore(endDate) ? workEnd : endDate;

        if (overlapEnd.isAfter(overlapStart)) {
          duration += overlapEnd.diff(overlapStart, 'hour', true);
        }
      }

      current = current.add(1, 'day').startOf('day');
    }

    return duration.toFixed(2);
  }
}

export default SLAClock;
