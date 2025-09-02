import React, { useEffect, useState } from "react";
import IncidentHistoryList from "../components/ServiceDesk/TicketHistory/IncidentHistoryList";
import { getAllIncident } from "../api/IncidentRequest";

const IncidentHistoryPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllIncident()
      .then((res) => {
        setIncidents(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Incident & Service Request History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <IncidentHistoryList incidents={incidents} />
      )}
    </div>
  );
};

export default IncidentHistoryPage;