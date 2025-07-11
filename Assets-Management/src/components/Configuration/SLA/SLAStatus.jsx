import React from 'react';
import SLAClock from '../utils/SLAClock'; // Your SLA logic
// You can remove the import below if you define formatMinutesToHHMM here

/**
 * Convert minutes to human-readable "X hr Y min" format
 */
function formatMinutesToHHMM(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? `${hrs} hr ` : ''}${mins} min`;
}

function SLAStatus({ incident, slaTimeline = [], serviceWindow = true }) {
  if (
    !incident ||
    !incident.submitter?.loggedInTime ||
    !incident.sla
  ) return null;

  const now = new Date();
  const loggedInTime = new Date(incident.submitter.loggedInTime);
  const slaDeadline = new Date(incident.sla);

  // ⏱ Time used until now (live on refresh)
  const slaUsedMinutes = SLAClock(loggedInTime, now, serviceWindow, slaTimeline);
  const formattedSLAUsed = formatMinutesToHHMM(slaUsedMinutes);

  // ⏳ Total SLA allowed (from loggedInTime → sla deadline)
  const totalSLAMinutes = SLAClock(loggedInTime, slaDeadline, serviceWindow, slaTimeline);
  const formattedTotalSLA = formatMinutesToHHMM(totalSLAMinutes);

  const isBreached = now > slaDeadline;

  return (
    <div style={{ padding: '0.5rem', background: isBreached ? '#ffe5e5' : '#e5ffe5', borderRadius: '6px' }}>
      <p style={{ margin: 0 }}>
        ⏱ SLA Used: <strong>{formattedSLAUsed}</strong> / <strong>{formattedTotalSLA}</strong>
        {isBreached && <span style={{ color: 'red', fontWeight: 'bold' }}> – SLA Breached</span>}
      </p>
    </div>
  );
}

export default SLAStatus;
