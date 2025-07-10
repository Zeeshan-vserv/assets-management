import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Autocomplete, TextField } from "@mui/material";
import { getAllDepartment } from "../../../api/DepartmentRequest";
import { getAllIncident } from "../../../api/IncidentRequest";
import { NavLink } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MdModeEdit } from "react-icons/md";
import { getAllSLAs } from "../../../api/slaRequest";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const IncidentsData = () => {
  const [data, setData] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDepartment = async () => {
    try {
      setIsLoading(true);
      // const response = await getAllDepartment();
      const response = await getAllIncident();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchSlaCreation = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSLAs();
      setSlaData(response?.data?.data[0] || []);
    } catch (error) {
      console.error("Error fetching holiday calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaCreation();
  }, []);

  // console.log("sladata", slaData, "data", data[0].createdAt);

  // const getSLAWorkingMinutes = (createdAtStr, slaTimeline) => {
  //   const slaHoursByDay = {};
  //   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
  //     slaHoursByDay[weekDay] = {
  //       start:
  //         new Date(startTime).getUTCHours() * 60 +
  //         new Date(startTime).getUTCMinutes(),
  //       end:
  //         new Date(endTime).getUTCHours() * 60 +
  //         new Date(endTime).getUTCMinutes(),
  //     };
  //   });

  //   let totalMinutes = 0;
  //   let startDate = new Date(createdAtStr);
  //   const now = new Date();

  //   while (startDate < now) {
  //     const dayName = startDate.toLocaleDateString("en-US", {
  //       weekday: "long",
  //       timeZone: "UTC",
  //     });
  //     const daySla = slaHoursByDay[dayName];

  //     if (daySla) {
  //       const [startMin, endMin] = [daySla.start, daySla.end];

  //       const startHour = Math.floor(startMin / 60);
  //       const startMinute = startMin % 60;
  //       const endHour = Math.floor(endMin / 60);
  //       const endMinute = endMin % 60;

  //       const workStart = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           startHour,
  //           startMinute
  //         )
  //       );
  //       let workEnd = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           endHour,
  //           endMinute
  //         )
  //       );

  //       if (endMin < startMin) {
  //         workEnd.setUTCDate(workEnd.getUTCDate() + 1);
  //       }

  //       const rangeStart = startDate > workStart ? startDate : workStart;
  //       const rangeEnd = now < workEnd ? now : workEnd;

  //       if (rangeStart < rangeEnd) {
  //         const diff = (rangeEnd - rangeStart) / (1000 * 60);
  //         totalMinutes += diff;
  //       }
  //     }

  //     startDate.setUTCDate(startDate.getUTCDate() + 1);
  //     startDate.setUTCHours(0, 0, 0, 0);
  //   }

  //   return totalMinutes;
  // };

  // const getSLAWorkingMinutes = (createdAtStr, slaTimeline) => {
  //   const slaHoursByDay = {};

  //   // Map SLA timelines to minutes
  //   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     slaHoursByDay[weekDay] = {
  //       start: start.getUTCHours() * 60 + start.getUTCMinutes(),
  //       end: end.getUTCHours() * 60 + end.getUTCMinutes(),
  //     };
  //   });

  //   let totalMinutes = 0;
  //   let startDate = new Date(createdAtStr);
  //   const now = new Date();

  //   while (startDate < now) {
  //     const dayName = startDate.toLocaleDateString("en-US", {
  //       weekday: "long",
  //       timeZone: "UTC",
  //     });
  //     const daySla = slaHoursByDay[dayName];

  //     if (daySla) {
  //       const [startMin, endMin] = [daySla.start, daySla.end];

  //       const startHour = Math.floor(startMin / 60);
  //       const startMinute = startMin % 60;
  //       const endHour = Math.floor(endMin / 60);
  //       const endMinute = endMin % 60;

  //       const dayStart = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           startHour,
  //           startMinute
  //         )
  //       );
  //       let dayEnd = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           endHour,
  //           endMinute
  //         )
  //       );

  //       // Handle overnight shift
  //       if (endMin < startMin) {
  //         dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
  //       }

  //       const effectiveStart = startDate > dayStart ? startDate : dayStart;
  //       const effectiveEnd = now < dayEnd ? now : dayEnd;

  //       if (effectiveStart < effectiveEnd) {
  //         const diffMinutes =
  //           (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60);
  //         totalMinutes += diffMinutes;
  //       }
  //     }

  //     // Move to next day
  //     startDate.setUTCDate(startDate.getUTCDate() + 1);
  //     startDate.setUTCHours(0, 0, 0, 0);
  //   }

  //   return totalMinutes;
  // };

  // const getSLAWorkingMinutes = (
  //   createdAtStr,
  //   slaTimeline,
  //   now = new Date()
  // ) => {
  //   const slaHoursByDay = {};

  //   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     slaHoursByDay[weekDay] = {
  //       start: start.getUTCHours() * 60 + start.getUTCMinutes(),
  //       end: end.getUTCHours() * 60 + end.getUTCMinutes(),
  //     };
  //   });

  //   let totalMinutes = 0;
  //   let startDate = new Date(createdAtStr);

  //   while (startDate < now) {
  //     const dayName = startDate.toLocaleDateString("en-US", {
  //       weekday: "long",
  //       timeZone: "UTC",
  //     });
  //     const daySla = slaHoursByDay[dayName];

  //     if (daySla) {
  //       const [startMin, endMin] = [daySla.start, daySla.end];

  //       const startHour = Math.floor(startMin / 60);
  //       const startMinute = startMin % 60;
  //       const endHour = Math.floor(endMin / 60);
  //       const endMinute = endMin % 60;

  //       const dayStart = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           startHour,
  //           startMinute
  //         )
  //       );
  //       let dayEnd = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           endHour,
  //           endMinute
  //         )
  //       );

  //       // Handle overnight shift
  //       if (endMin < startMin) {
  //         dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
  //       }

  //       const effectiveStart = startDate > dayStart ? startDate : dayStart;
  //       const effectiveEnd = now < dayEnd ? now : dayEnd;

  //       if (effectiveStart < effectiveEnd) {
  //         const diffMinutes =
  //           (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60);
  //         totalMinutes += diffMinutes;
  //       }
  //     }

  //     // Move to next day
  //     startDate.setUTCDate(startDate.getUTCDate() + 1);
  //     startDate.setUTCHours(0, 0, 0, 0);
  //   }

  //   return totalMinutes;
  // };

  // const getSLAWorkingMinutes = (
  //   createdAtStr,
  //   slaTimeline,
  //   now = new Date()
  // ) => {
  //   const slaHoursByDay = {};

  //   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     slaHoursByDay[weekDay] = {
  //       start: start.getUTCHours() * 60 + start.getUTCMinutes(),
  //       end: end.getUTCHours() * 60 + end.getUTCMinutes(),
  //     };
  //   });

  //   let totalMinutes = 0;
  //   let startDate = new Date(createdAtStr);

  //   while (startDate < now) {
  //     const dayName = startDate.toLocaleDateString("en-US", {
  //       weekday: "long",
  //       timeZone: "UTC",
  //     });
  //     const daySla = slaHoursByDay[dayName];

  //     if (daySla) {
  //       const [startMin, endMin] = [daySla.start, daySla.end];

  //       const startHour = Math.floor(startMin / 60);
  //       const startMinute = startMin % 60;
  //       const endHour = Math.floor(endMin / 60);
  //       const endMinute = endMin % 60;

  //       const dayStart = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           startHour,
  //           startMinute
  //         )
  //       );
  //       let dayEnd = new Date(
  //         Date.UTC(
  //           startDate.getUTCFullYear(),
  //           startDate.getUTCMonth(),
  //           startDate.getUTCDate(),
  //           endHour,
  //           endMinute
  //         )
  //       );

  //       // Handle overnight shifts
  //       if (endMin < startMin) {
  //         dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
  //       }

  //       const effectiveStart = startDate > dayStart ? startDate : dayStart;
  //       const effectiveEnd = now < dayEnd ? now : dayEnd;

  //       if (effectiveStart < effectiveEnd) {
  //         const diffMinutes =
  //           (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60);
  //         totalMinutes += diffMinutes;
  //       }
  //     }

  //     // Move to next day
  //     startDate.setUTCDate(startDate.getUTCDate() + 1);
  //     startDate.setUTCHours(0, 0, 0, 0);
  //   }

  //   return totalMinutes;
  // };
  // const getSLAWorkingMinutes = (
  //   createdAtStr,
  //   slaTimeline,
  //   now = new Date()
  // ) => {
  //   const slaHoursByDay = {};

  //   // Map SLA timings to minutes for each weekday
  //   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     slaHoursByDay[weekDay] = {
  //       start: start.getUTCHours() * 60 + start.getUTCMinutes(),
  //       end: end.getUTCHours() * 60 + end.getUTCMinutes(),
  //     };
  //     // console.log(slaHoursByDay[weekDay]);

  //   });

  //   let totalMinutes = 0;
  //   let current = new Date(createdAtStr);

  //   // console.log(current , now, "current and now");

  //   while (current < now) {
  //     const dayName = current.toLocaleDateString("en-US", {
  //       weekday: "long",
  //       timeZone: "UTC",
  //     }
  //   );
  //   // console.log(dayName, "dayName")

  //     const daySla = slaHoursByDay[dayName];

  //     if (daySla) {
  //       const { start: startMin, end: endMin } = daySla;

  //       const startHour = Math.floor(startMin / 60);
  //       const startMinute = startMin % 60;
  //       const endHour = Math.floor(endMin / 60);
  //       const endMinute = endMin % 60;

  //       // console.log(startHour, startMinute, endHour, endMinute, "start and end time");

  //       const dayStart = new Date(
  //         Date.UTC(
  //           current.getUTCFullYear(),
  //           current.getUTCMonth(),
  //           current.getUTCDate(),
  //           startHour,
  //           startMinute
  //         )
  //       );

  //       let dayEnd = new Date(
  //         Date.UTC(
  //           current.getUTCFullYear(),
  //           current.getUTCMonth(),
  //           current.getUTCDate(),
  //           endHour,
  //           endMinute
  //         )
  //       );

  //       console.log(dayStart, dayEnd, "dayStart and dayEnd");

  //       // If SLA ends after midnight
  //       if (endMin < startMin) {
  //         dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
  //       }

  //       // Effective working time window for this day
  //       const effectiveStart = current > dayStart ? current : dayStart;
  //       const effectiveEnd = now < dayEnd ? now : dayEnd;

  //       if (effectiveStart < effectiveEnd) {
  //         const diff = (effectiveEnd - effectiveStart) / (1000 * 60); // in minutes
  //         totalMinutes += diff;
  //       }
  //     }

  //     // Go to next day at 00:00 UTC
  //     current.setUTCDate(current.getUTCDate() + 1);
  //     current.setUTCHours(0, 0, 0, 0);
  //   }

  //   return totalMinutes;
  // };

  // const getSLAWorkingMinutes = (
  //   createdAtStr,
  //   slaTimeline,
  //   now = new Date()
  // ) => {
  //   const IST_OFFSET_MINUTES = 330; // 5 hours 30 mins = 330 mins
  //   const slaHoursByDay = {};

  //   // Convert SLA time range to minutes for each weekday in IST
  //   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     // Assumes startTime/endTime are in UTC → convert to IST
  //     const startISTMinutes =
  //       (start.getUTCHours() * 60 +
  //         start.getUTCMinutes() +
  //         IST_OFFSET_MINUTES) %
  //       (24 * 60);
  //     const endISTMinutes =
  //       (end.getUTCHours() * 60 + end.getUTCMinutes() + IST_OFFSET_MINUTES) %
  //       (24 * 60);

  //     slaHoursByDay[weekDay] = {
  //       start: startISTMinutes,
  //       end: endISTMinutes,
  //     };
  //     console.log(slaHoursByDay[weekDay]);

  //   });

  //   let totalMinutes = 0;
  //   let current = new Date(createdAtStr);

  //   while (current < now) {
  //     // Convert `current` to IST
  //     const currentIST = new Date(
  //       current.getTime() + IST_OFFSET_MINUTES * 60000
  //     );
  //     const nowIST = new Date(now.getTime() + IST_OFFSET_MINUTES * 60000);

  //     const dayName = currentIST.toLocaleDateString("en-US", {
  //       weekday: "long",
  //     });

  //     const daySla = slaHoursByDay[dayName];

  //     if (daySla) {
  //       const { start: startMin, end: endMin } = daySla;

  //       const startHour = Math.floor(startMin / 60);
  //       const startMinute = startMin % 60;
  //       const endHour = Math.floor(endMin / 60);
  //       const endMinute = endMin % 60;

  //       const dayStartIST = new Date(
  //         Date.UTC(
  //           currentIST.getFullYear(),
  //           currentIST.getMonth(),
  //           currentIST.getDate(),
  //           0,
  //           0
  //         )
  //       );
  //       dayStartIST.setMinutes(startMin);

  //       let dayEndIST = new Date(
  //         Date.UTC(
  //           currentIST.getFullYear(),
  //           currentIST.getMonth(),
  //           currentIST.getDate(),
  //           0,
  //           0
  //         )
  //       );
  //       dayEndIST.setMinutes(endMin);

  //       // If SLA end time is before start time → overnight shift
  //       if (endMin < startMin) {
  //         dayEndIST.setDate(dayEndIST.getDate() + 1);
  //       }

  //       const effectiveStart =
  //         currentIST > dayStartIST ? currentIST : dayStartIST;
  //       const effectiveEnd = nowIST < dayEndIST ? nowIST : dayEndIST;

  //       if (effectiveStart < effectiveEnd) {
  //         const diff = (effectiveEnd - effectiveStart) / (1000 * 60);
  //         totalMinutes += diff;
  //       }
  //     }

  //     // Move `current` to next day at 00:00 UTC
  //     current.setUTCDate(current.getUTCDate() + 1);
  //     current.setUTCHours(0, 0, 0, 0);
  //   }

  //   return Math.floor(totalMinutes);
  // };

  const getSLAWorkingMinutes = (
    createdAtStr,
    slaTimeline,
    now = new Date()
  ) => {
    const slaHoursByDay = {};

    // Convert SLA timeline to minutes (assumed already in IST)
    slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
      const start = new Date(startTime); // IST
      const end = new Date(endTime); // IST

      slaHoursByDay[weekDay] = {
        start: start.getHours() * 60 + start.getMinutes(),
        end: end.getHours() * 60 + end.getMinutes(),
      };
    });

    let totalMinutes = 0;
    let current = new Date(createdAtStr); // IST-based

    while (current < now) {
      const dayName = current.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const daySla = slaHoursByDay[dayName];

      if (daySla) {
        const { start: startMin, end: endMin } = daySla;

        const startHour = Math.floor(startMin / 60);
        const startMinute = startMin % 60;
        const endHour = Math.floor(endMin / 60);
        const endMinute = endMin % 60;

        const dayStart = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          startHour,
          startMinute
        );

        let dayEnd = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          endHour,
          endMinute
        );

        // Handle overnight SLA (e.g. 10 PM to 6 AM)
        if (endMin < startMin) {
          dayEnd.setDate(dayEnd.getDate() + 1);
        }

        const effectiveStart = current > dayStart ? current : dayStart;
        const effectiveEnd = now < dayEnd ? now : dayEnd;

        if (effectiveStart < effectiveEnd) {
          const diff = (effectiveEnd - effectiveStart) / (1000 * 60); // in minutes
          totalMinutes += diff;
        }
      }

      // Move to next day, midnight IST
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }

    return Math.floor(totalMinutes);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "incidentId",
        header: "Incident ID",
      },
      {
        accessorKey: "classificaton.",
        header: "Status",
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "subCategory",
        header: "Sub Category",
      },
      {
        accessorKey: "submitter.user",
        header: "Submitter",
      },
      {
        accessorKey: "assetDetails.asset",
        header: "Asset Id",
      },
      {
        accessorKey: "locationDetails.location",
        header: "Location",
      },
      {
        accessorKey: "locationDetails.subLocation",
        header: "Sub Location",
      },
      {
        accessorKey: "departmentName",
        header: "Logged Time",
      },
      {
        accessorKey: "classificaton.severityLevel",
        header: "Severity",
      },
      {
        accessorKey: "classificaton.technician",
        header: "Assigned To",
      },
      // {
      //   accessorKey: "departmentName",
      //   header: "SLA",
      // },
      // {
      //   id: "slaTime",
      //   header: "SLA Time",
      //   Cell: ({ row }) => {
      //     const createdAt = row.original.createdAt;
      //     if (!createdAt || !slaData?.slaTimeline) return "-";

      //     const minutes = getSLAWorkingMinutes(createdAt, slaData.slaTimeline);
      //     const hours = Math.floor(minutes / 60);
      //     const mins = Math.floor(minutes % 60);
      //     return `${hours}h ${mins}m`;
      //   },
      // },
      // {
      //   id: "slaTime",
      //   header: "SLA Time",
      //   Cell: ({ row }) => {
      //     const createdAt = row.original.createdAt;
      //     if (!createdAt || !slaData?.slaTimeline) return "-";

      //     // Pass currentTime for live updates
      //     const minutes = getSLAWorkingMinutes(
      //       createdAt,
      //       slaData.slaTimeline,
      //       currentTime
      //     );
      //     const hours = Math.floor(minutes / 60);
      //     const mins = Math.floor(minutes % 60);
      //     return `${hours}h ${mins}m`;
      //   },
      // },

      // {
      //   id: "slaTime",
      //   header: "SLA Time",
      //   Cell: ({ row }) => {
      //     const createdAt = row.original.createdAt;
      //     if (!createdAt || !slaData?.slaTimeline) return "-";

      //     // Pass currentTime for live updates
      //     const minutes = Math.floor(
      //       getSLAWorkingMinutes(createdAt, slaData.slaTimeline, currentTime)
      //     );
      //     console.log(createdAt, slaData.slaTimeline, currentTime)

      //     const days = Math.floor(minutes / (24 * 60));
      //     const hours = Math.floor((minutes % (24 * 60)) / 60);
      //     const mins = minutes % 60;

      //     let result = "";
      //     if (days > 0) result += `${days}d `;
      //     if (hours > 0 || days > 0) result += `${hours}h `;
      //     result += `${mins}m`;
      //     return result.trim();
      //   },
      // },

      {
        id: "slaTime",
        header: "SLA Time",
        Cell: ({ row }) => {
          const createdAt = row.original.createdAt;
          if (!createdAt || !slaData?.slaTimeline) return "-";

          // Get working minutes
          const minutes = getSLAWorkingMinutes(
            createdAt,
            slaData.slaTimeline,
            currentTime
          );
          const days = Math.floor(minutes / (24 * 60));
          const hours = Math.floor((minutes % (24 * 60)) / 60);
          const mins = Math.round(minutes % 60); // use round for accuracy

          let result = "";
          if (days > 0) result += `${days}d `;
          if (hours > 0 || days > 0) result += `${hours}h `;
          result += `${mins}m`;

          return result.trim();
        },
      },

      {
        accessorKey: "departmentName",
        header: "TAT",
      },
      {
        accessorKey: "classificaton.supportDepartmentName",
        header: "Support Department",
      },
      {
        accessorKey: "classificaton.supportGroupName",
        header: "Support Group",
      },
      {
        accessorKey: "departmentName",
        header: "Feedback Available",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton color="primary" aria-label="edit">
            <NavLink to={`/main/ServiceDesk/EditIncident/${row.original._id}`}>
              <MdModeEdit />
            </NavLink>
          </IconButton>
        ),
      },
    ],
    [isLoading, slaData, currentTime]
  );

  //Exports
  const handleExportRows = (rows) => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete"
      );

    const rowData = rows.map((row) => {
      const result = {};
      visibleColumns.forEach((col) => {
        const key = col.id || col.accessorKey;
        result[key] = row.original[key];
      });
      return result;
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };
  const handleExportData = () => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete"
      );

    const exportData = data.map((item) => {
      const result = {};
      visibleColumns.forEach((col) => {
        const key = col.id || col.accessorKey;
        result[key] = item[key];
      });
      return result;
    });

    const csv = generateCsv(csvConfig)(exportData);
    download(csvConfig)(csv);
  };

  const handlePdfData = () => {
    const excludedColumns = ["mrt-row-select", "edit", "delete"];

    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && !excludedColumns.includes(col.id));

    // Prepare headers for PDF
    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);

    // Prepare data rows for PDF
    const exportData = data.map((item) =>
      visibleColumns.map((col) => {
        const key = col.id || col.accessorKey;
        let value = item[key];
        return value ?? "";
      })
    );

    const doc = new jsPDF({});
    autoTable(doc, {
      head: [headers],
      body: exportData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 20 },
    });
    doc.save("Assets-Management-Components.pdf");
  };

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
      pagination: { pageSize: 5 },
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box className="flex flex-wrap w-full">
          <NavLink to="/main/ServiceDesk/NewIncident">
            <Button
              variant="contained"
              size="small"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                backgroundColor: "#2563eb",
                color: "#fff",
                textTransform: "none",
                mt: 1,
                mb: 1,
              }}
            >
              New Asset
            </Button>
          </NavLink>
          <Autocomplete
            className="w-[15%]"
            sx={{
              ml: 2,
              mt: 1,
              mb: 1,
              "& .MuiInputBase-root": {
                borderRadius: "0.35rem",
                backgroundColor: "#f9fafb",
                fontSize: "0.85rem",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              },
              "& .MuiInputBase-root:hover": {
                borderColor: "#94a3b8",
              },
            }}
            options={[
              "My Tickets",
              "Group Tickets",
              "Department Tickets",
              "All Tickets",
            ]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { fontSize: "0.85rem", padding: "8px" },
                }}
              />
            )}
          />

          <Button
            onClick={handlePdfData}
            startIcon={<AiOutlineFilePdf />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export as PDF
          </Button>
          <Button
            onClick={handleExportData}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export All Data
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export Page Rows
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export Selected Rows
          </Button>
        </Box>
      );
    },

    muiTableProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: {
          captionSide: "top",
        },
      },
    },

    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 15],
      shape: "rounded",
      variant: "outlined",
    },
    enablePagination: true,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f1f5fa",
        color: "#303E67",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 1 ? "#f1f5fa" : "inherit",
      },
    }),
  });

  const cardData = [
    {
      id: "1",
      totalCount: "100",
      description: "New",
    },
    {
      id: "2",
      storeCount: "70",
      description: "Assigned",
    },
    {
      id: "3",
      allocatedCount: "40",
      description: "In-Progress",
    },
    {
      id: "4",
      inRepairCount: "30",
      description: "Pause",
    },
    {
      id: "5",
      inTransitCount: "10",
      description: "Resolved",
    },
    {
      id: "6",
      handOverCount: "0",
      description: "Cancelled",
    },
    {
      id: "7",
      underRecoveryCount: "0",
      description: "Reopened",
    },
    {
      id: "8",
      discardReplacedCount: "0",
      description: "Closed",
    },
    {
      id: "9",
      theftLostCount: "0",
      description: "Converted to SR",
    },
    {
      id: "11",
      soldCount: "0",
      description: "Total",
    },
  ];

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">INCIDENT DATA</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {cardData.map((item) => {
            const countKey = Object.keys(item).find((key) =>
              key.endsWith("Count")
            );
            const count = item[countKey];

            return (
              <div
                key={item?.id}
                className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 text-gray-700 transition"
              >
                <h2 className="font-semibold text-xl text-blue-600 mb-1">
                  {count}
                </h2>
                <span className="text-sm">{item.description}</span>
              </div>
            );
          })}
        </div>

        <MaterialReactTable table={table} />
      </div>
    </>
  );
};

export default IncidentsData;

// import React, { useEffect, useMemo, useState } from "react";
// import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
// import { Box, CircularProgress } from "@mui/material";
// import { getAllIncident } from "../../../api/IncidentRequest";
// import { getAllSLAs } from "../../../api/slaRequest";

// const getSLAWorkingMinutes = (createdAtStr, slaTimeline, now = new Date()) => {
//   const slaHoursByDay = {};

//   // Parse SLA timings into minutes in IST
//   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     slaHoursByDay[weekDay] = {
//       startMinutes: start.getHours() * 60 + start.getMinutes(),
//       endMinutes: end.getHours() * 60 + end.getMinutes(),
//     };
//   });

//   let totalMinutes = 0;
//   let current = new Date(createdAtStr);

//   while (current < now) {
//     const dayName = current.toLocaleDateString("en-US", { weekday: "long" });
//     const sla = slaHoursByDay[dayName];

//     if (sla) {
//       const { startMinutes, endMinutes } = sla;

//       const workStart = new Date(
//         current.getFullYear(),
//         current.getMonth(),
//         current.getDate(),
//         Math.floor(startMinutes / 60),
//         startMinutes % 60,
//         0
//       );

//       let workEnd = new Date(
//         current.getFullYear(),
//         current.getMonth(),
//         current.getDate(),
//         Math.floor(endMinutes / 60),
//         endMinutes % 60,
//         0
//       );

//       if (endMinutes <= startMinutes) {
//         workEnd.setDate(workEnd.getDate() + 1);
//       }

//       const effectiveStart = current > workStart ? current : workStart;
//       const effectiveEnd = now < workEnd ? now : workEnd;

//       if (effectiveStart < effectiveEnd) {
//         const diff = Math.floor((effectiveEnd - effectiveStart) / (1000 * 60));
//         totalMinutes += diff;
//       }
//     }

//     // Move to next day
//     current.setDate(current.getDate() + 1);
//     current.setHours(0, 0, 0, 0);
//   }

//   return totalMinutes;
// };

// const IncidentSLAView = () => {
//   const [data, setData] = useState([]);
//   const [slaData, setSlaData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const incidentsRes = await getAllIncident();
//         const slaRes = await getAllSLAs();

//         setData(incidentsRes?.data?.data || []);
//         setSlaData(slaRes?.data?.data?.[0] || null);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const columns = useMemo(() => [
//     {
//       accessorKey: "incidentId",
//       header: "Incident ID",
//     },
//     {
//       accessorKey: "subject",
//       header: "Subject",
//     },
//     {
//       accessorKey: "category",
//       header: "Category",
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created At",
//       Cell: ({ cell }) =>
//         new Date(cell.getValue()).toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//     },
//     {
//       id: "slaTime",
//       header: "SLA Time (IST)",
//       Cell: ({ row }) => {
//         const createdAt = row.original.createdAt;
//         if (!createdAt || !slaData?.slaTimeline) return "-";

//         const totalMinutes = getSLAWorkingMinutes(createdAt, slaData.slaTimeline, currentTime);
//         const hours = Math.floor(totalMinutes / 60);
//         const minutes = totalMinutes % 60;

//         return `${hours}h ${minutes}m`;
//       },
//     },
//   ], [slaData, currentTime]);

//   const table = useMaterialReactTable({
//     data,
//     columns,
//     getRowId: (row) => row._id,
//     initialState: {
//       pagination: { pageSize: 5 },
//     },
//     enablePagination: true,
//   });

//   return (
//     <Box p={2}>
//       <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Incident SLA Tracker</h2>
//       {isLoading ? (
//         <CircularProgress />
//       ) : (
//         <MaterialReactTable table={table} />
//       )}
//     </Box>
//   );
// };

// export default IncidentSLAView;
