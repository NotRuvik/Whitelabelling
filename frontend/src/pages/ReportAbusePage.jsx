// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Container,
//   CircularProgress,
//   Tooltip,
// } from '@mui/material';
// import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
// import { getAbuseReports } from '../services/report.service';
// import GenericTable from '../genricCompoennts/GenericTable';
// import { StatusPill } from '../genricCompoennts/CustomTableParts';
// import ResolveReportModal from '../modals/ResolveReportModal';

// const AbuseReportsDashboard = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedReport, setSelectedReport] = useState(null);

//   // State for pagination, sorting, and searching
//   const [totalRowCount, setTotalRowCount] = useState(0);
//   const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
//   const [sortModel, setSortModel] = useState([{ field: 'createdAt', sort: 'desc' }]);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchReports = useCallback(async () => {
//     setLoading(true);
//     try {
//       const sortField = sortModel[0]?.field || 'createdAt';
//       const sortOrder = sortModel[0]?.sort || 'desc';

//       const response = await getAbuseReports(
//         paginationModel.page + 1,
//         paginationModel.pageSize,
//         sortField,
//         sortOrder,
//         searchQuery
//       );

//       const { data, pagination } = response.data.data;
//       console.log("const { data, pagination } = response.data;",data, pagination)
//       setReports(data);
//       setTotalRowCount(pagination.totalItems);
//     } catch (err) {
//       setError('Failed to fetch abuse reports.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [paginationModel, sortModel, searchQuery]);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//    const handleSearch = (query) => {
//     setSearchQuery(query);
//     setPaginationModel({ ...paginationModel, page: 0 });
//   };

//   const handleOpenModal = (report) => {
//     setSelectedReport(report);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedReport(null);
//     setModalOpen(false);
//   };

//   const handleReportResolved = () => {
//     fetchReports();
//   };

//   const columns = [
//     {
//       field: 'reportedContent',
//       headerName: 'Reported Content',
//       sortable: false,
//       render: (_, row) => {
//         if (row.reportType === 'missionary' && row.reportedMissionary?.userId) {
//           const user = row.reportedMissionary.userId;
//           return `${user.firstName} ${user.lastName}`;
//         }
//         if (row.reportType === 'cause' && row.reportedCause) {
//           return `Cause: "${row.reportedCause.name}"`;
//         }
//         return 'N/A';
//       },
//     },
//     {
//       field: 'reportType',
//       headerName: 'Type',
//     },
//     {
//       field: 'abuseType',
//       headerName: 'Reason',
//     },
//     {
//       field: 'reporterEmail',
//       headerName: 'Reporter',
//       render: (email) => email || 'Anonymous',
//     },
//     {
//       field: 'status',
//       headerName: 'Status',
//       render: (status) => (
//         <StatusPill active={status !== 'pending'}>
//           <div className="status-dot" />
//             {status === 'pending' ? 'Pending' : 'Resolved'}
//         </StatusPill>
//       ),
//     },
//     {
//         field: 'createdAt',
//         headerName: 'Date',
//         render: (date) => new Date(date).toLocaleDateString(),
//     }
//   ];

//   const actions = [
//     {
//       label: 'Take Action',
//       icon: <CrisisAlertIcon  />,
//       onClick: (row) => handleOpenModal(row),
//       // Only show this button for pending reports
//       shouldRender: (row) => row.status === 'pending',
//     },
//   ];

//   if (error) {
//     return (
//       <Typography color="error" textAlign="center" sx={{ my: 5 }}>
//         {error}
//       </Typography>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
//         Abuse Reports
//       </Typography>

//       <GenericTable
//         columns={columns}
//         data={reports}
//         actions={actions}
//         isLoading={loading}
//         rowCount={totalRowCount}
//         paginationModel={paginationModel}
//         onPaginationModelChange={setPaginationModel}
//         sortModel={sortModel}
//         onSortModelChange={setSortModel}
//         onSearch={handleSearch}
//       />

//       <ResolveReportModal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         report={selectedReport}
//         onReportResolved={handleReportResolved}
//       />
//     </Container>
//   );
// };

// export default AbuseReportsDashboard;
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import { getAbuseReports } from "../services/report.service";
import GenericTable from "../genricCompoennts/GenericTable";
import { StatusPill } from "../genricCompoennts/CustomTableParts";
import ResolveReportModal from "../modals/ResolveReportModal";

const AbuseReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [totalRowCount, setTotalRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const sortField = sortModel[0]?.field || "createdAt";
      const sortOrder = sortModel[0]?.sort || "desc";
      const response = await getAbuseReports(
        paginationModel.page + 1,
        paginationModel.pageSize,
        sortField,
        sortOrder,
        searchQuery
      );
      const { data, pagination } = response.data.data;
      setReports(data);
      setTotalRowCount(pagination.totalItems);
    } catch (err) {
      setError("Failed to fetch abuse reports.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, sortModel, searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setModalOpen(false);
  };

  const handleReportResolved = () => {
    fetchReports();
  };

  const handleSortChange = (field) => {
    const currentSort = sortModel[0];
    const isSameField = currentSort.field === field;
    const newSort = isSameField && currentSort.sort === "asc" ? "desc" : "asc";
    setSortModel([{ field, sort: newSort }]);
  };

  const handlePageChange = (event, newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const columns = [
    {
      field: "reportedContent",
      headerName: "Reported Content",
      sortable: false,
      render: (_, row) => {
        if (row.reportType === "missionary" && row.reportedMissionary?.userId) {
          const user = row.reportedMissionary.userId;
          return `${user.firstName} ${user.lastName}`;
        }
        if (row.reportType === "cause" && row.reportedCause) {
          return `Cause: "${row.reportedCause.name}"`;
        }
        return "N/A";
      },
    },
    { field: "reportType", headerName: "Type", sortable: true },
    { field: "abuseType", headerName: "Reason", sortable: true },
    {
      field: "reporterEmail",
      headerName: "Reporter",
      sortable: true,
      render: (email) => email || "Anonymous",
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      render: (status) => (
        <StatusPill active={status !== "pending"}>
          <div className="status-dot" />
          {status === "pending" ? "Pending" : "Resolved"}
        </StatusPill>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      label: "Take Action",
      icon: <CrisisAlertIcon />,
      onClick: (row) => handleOpenModal(row),
      shouldRender: (row) => row.status === "pending",
    },
  ];

  if (error) {
    return (
      <Typography color="error" textAlign="center" sx={{ my: 5 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Abuse Reports
      </Typography>

      <GenericTable
        columns={columns}
        data={reports}
        actions={actions}
        isLoading={loading}
        page={paginationModel.page}
        rowsPerPage={paginationModel.pageSize}
        total={totalRowCount}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        sortField={sortModel[0]?.field}
        sortOrder={sortModel[0]?.sort}
      />

      <ResolveReportModal
        open={modalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
        onReportResolved={handleReportResolved}
      />
    </Container>
  );
};

export default AbuseReportsDashboard;
