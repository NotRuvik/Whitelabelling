// // // src/pages/MissionariesPage.js
// // import React, { useState, useEffect } from "react";
// // import {
// //   Typography,
// //   Paper,
// //   Box,
// //   Button,
// //   Stack,
// //   InputBase,
// //   Select,
// //   MenuItem,
// // } from "@mui/material";
// // import AddIcon from "@mui/icons-material/Add";
// // import SearchIcon from "@mui/icons-material/Search";
// // import VisibilityIcon from "@mui/icons-material/Visibility";
// // import BlockIcon from "@mui/icons-material/Block";
// // import LockOpenIcon from "@mui/icons-material/LockOpen";
// // import GenericTable from "../genricCompoennts/GenericTable";
// // import {
// //   getMissionaries,
// //   blockMissionary,
// //   unblockMissionary,
// // } from "../services/missionary.service";
// // import AddMissionaryModal from "../modals/AddMissionaryModal";
// // import { useAuth } from "../contexts/AuthContext";
// // import { getBases } from "../services/base.service";

// // const MissionariesPage = () => {
// //   const [missionaries, setMissionaries] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filters, setFilters] = useState({ status: "all", search: "" });
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const { user } = useAuth();
// //   const [bases, setBases] = useState([]);
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [total, setTotal] = useState(0);
// //   const [sortField, setSortField] = useState("");
// //   const [sortOrder, setSortOrder] = useState("asc");

// //   // Updated loadMissionaries to accept an options object for clarity and flexibility
// //   const loadMissionaries = async (options = {}) => {
// //     setLoading(true);
// //     try {
// //       const {
// //         newPage = page,
// //         newRowsPerPage = rowsPerPage,
// //         search = filters.search, // Use current filter search as default
// //         sortField: currentSortField = sortField, // Use current sort field as default
// //         sortOrder: currentSortOrder = sortOrder, // Use current sort order as default
// //       } = options;

// //       // Ensure API call parameters are bundled into a single object
// //       const response = await getMissionaries({
// //         page: newPage + 1,
// //         limit: newRowsPerPage,
// //         search,
// //         sortField: currentSortField,
// //         sortOrder: currentSortOrder,
// //       });
// //       setMissionaries(response.data.data.data);
// //       setTotal(response.data.data.total);
// //       setPage(response.data.data.page - 1);  
// //     } catch (error) {
// //       console.error("Failed to fetch missionaries:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (user) {
// //       // Initial load of missionaries when user changes or component mounts
// //       loadMissionaries({ newPage: 0, newRowsPerPage: rowsPerPage, search: filters.search, sortField, sortOrder }); 
// //       if (user.role === "npo_admin") {
// //         const fetchBases = async () => {
// //           try {
// //             const response = await getBases();
// //             setBases(response.data.data);
// //           } catch (error) {
// //             console.error("Failed to fetch bases:", error);
// //           }
// //         };
// //         fetchBases();
// //       }
// //     }
// //   }, [user?.role, rowsPerPage]); // Depend on user.role and rowsPerPage for initial load

// //   const handleSortChange = (field) => {
// //     const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
// //     setSortField(field);
// //     setSortOrder(newSortOrder);
// //     // Pass sorting parameters in the options object
// //     loadMissionaries({ newPage: page, newRowsPerPage: rowsPerPage, search: filters.search, sortField: field, sortOrder: newSortOrder }); 
// //   };

// //   const handleBlock = async (row) => {
// //     if (
// //       window.confirm(`Are you sure you want to block ${row.userId.firstName}?`)
// //     ) {
// //       await blockMissionary(row._id);
// //       loadMissionaries(); // Reload data after block action
// //     }
// //   };

// //   const handleUnblock = async (row) => {
// //     if (
// //       window.confirm(
// //         `Are you sure you want to unblock ${row.userId.firstName}?`
// //       )
// //     ) {
// //       await unblockMissionary(row._id);
// //       loadMissionaries(); // Reload data after unblock action
// //     }
// //   };

// //   const columns = [
// //     {
// //       field: "userId.firstName", // Added field for sortable functionality
// //       headerName: "Missionaries Name",
// //       render: (value, row) =>
// //         `${row.userId?.firstName} ${row.userId?.lastName}`,
// //       sortable: true, // Make this column sortable
// //     },
// //     {
// //       field: "baseId.location",
// //       headerName: "Base Location",
// //       render: (value, row) => row.baseId?.location || "N/A",
// //       sortable: true, // Make this column sortable
// //     },
// //     {
// //       field: "createdAt",
// //       headerName: "Registered",
// //       render: (value) => new Date(value).toLocaleDateString(),
// //       sortable: true, // Make this column sortable
// //     },
// //     {
// //       field: "isActive",
// //       headerName: "Status",
// //       render: (value) => (value ? "Active" : "Inactive"),
// //       sortable: true, // Make this column sortable
// //     },
// //     {
// //       field: "userId.email",
// //       headerName: "Email",
// //       render: (value, row) => row.userId?.email,
// //       sortable: true, // Make this column sortable
// //     },
// //   ];

// //   const actions = [
// //     { label: "View", icon: <VisibilityIcon /> /* onClick: () => {} */ },
// //     {
// //       label: "Block",
// //       icon: <BlockIcon color="warning" />,
// //       onClick: handleBlock,
// //       shouldRender: (row) => row.isActive,
// //     },
// //     {
// //       label: "Unblock",
// //       icon: <LockOpenIcon color="info" />,
// //       onClick: handleUnblock,
// //       shouldRender: (row) => !row.isActive,
// //     },
// //   ];

// //   const handleChangePage = (event, newPage) => {
// //     // Pass pagination and current sort/search parameters
// //     loadMissionaries({ newPage, newRowsPerPage: rowsPerPage, search: filters.search, sortField, sortOrder });
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     const newRowsPerPage = parseInt(event.target.value, 10);
// //     setRowsPerPage(newRowsPerPage);
// //     // Reset to first page when rows per page changes, keeping current sort/search
// //     loadMissionaries({ newPage: 0, newRowsPerPage, search: filters.search, sortField, sortOrder });
// //   };

// //   // Handle search input change
// //   const handleSearchChange = (event) => {
// //     setFilters(prev => ({ ...prev, search: event.target.value }));
// //   };

// //   // Handle search submission
// //   const handleSearchSubmit = (searchQuery) => {
// //     loadMissionaries({ newPage: 0, newRowsPerPage: rowsPerPage, search: searchQuery, sortField, sortOrder });
// //   };

// //   // Simplified filtering as search is now handled by API
// //   const filteredMissionaries = missionaries; // No client-side filtering needed for search/status if API handles it

// //   return (
// //     <Box>
// //       <Stack
// //         direction="row"
// //         justifyContent="space-between"
// //         alignItems="center"
// //         sx={{ mb: 3 }}
// //       >
// //         <Typography variant="h4" fontWeight={600}>
// //           Missionaries
// //         </Typography>
// //         <Button
// //           variant="contained"
// //           startIcon={<AddIcon />}
// //           onClick={() => setIsModalOpen(true)}
// //           sx={{
// //             ":hover": {
// //               backgroundColor: "primary.light",
// //             },
// //           }}
// //         >
// //           Add
// //         </Button>
// //       </Stack>

// //       <GenericTable
// //         columns={columns}
// //         data={filteredMissionaries}
// //         actions={actions}
// //         isLoading={loading}
// //         page={page}
// //         rowsPerPage={rowsPerPage}
// //         total={total}
// //         onPageChange={handleChangePage}
// //         onRowsPerPageChange={handleChangeRowsPerPage}
// //         onSearch={handleSearchSubmit} // Use the new search handler
// //         onSortChange={handleSortChange}
// //         sortField={sortField}
// //         sortOrder={sortOrder}
// //       />

// //       <AddMissionaryModal
// //         open={isModalOpen}
// //         onClose={() => setIsModalOpen(false)}
// //         onAdd={() => loadMissionaries()} // Reload after adding, no specific params needed for this refresh
// //         role={user?.role}
// //         bases={bases}
// //       />
// //     </Box>
// //   );
// // };

// // export default MissionariesPage;
// // src/pages/MissionariesPage.js
// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Paper,
//   Box,
//   Button,
//   Stack,
//   InputBase,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import BlockIcon from "@mui/icons-material/Block";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import GenericTable from "../genricCompoennts/GenericTable";
// import {
//   getMissionaries,
//   blockMissionary,
//   unblockMissionary,
//   getPublicMissionaries // Import the new API function
// } from "../services/missionary.service";
// import AddMissionaryModal from "../modals/AddMissionaryModal";
// import { useAuth } from "../contexts/AuthContext";
// import { getBases } from "../services/base.service";

// const MissionariesPage = () => {
//   const [missionaries, setMissionaries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({ status: "all", search: "" });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { user } = useAuth();
//   const [bases, setBases] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [sortField, setSortField] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");

//   const loadMissionaries = async (options = {}) => {
//     setLoading(true);
//     try {
//       const {
//         newPage = page,
//         newRowsPerPage = rowsPerPage,
//         search = filters.search,
//         sortField: currentSortField = sortField,
//         sortOrder: currentSortOrder = sortOrder,
//       } = options;

//       let response;
//       const params = {
//         page: newPage + 1,
//         limit: newRowsPerPage,
//         search,
//         sortField: currentSortField,
//         sortOrder: currentSortOrder,
//       };

//       if (user?.role === "super_admin") {
//         response = await getPublicMissionaries(params);
//       } else {
//         response = await getMissionaries(params);
//       }

//       setMissionaries(response.data.data.data); // Adjust based on the actual response structure for public API
//       setTotal(response.data.data.pagination ? response.data.data.pagination.totalMissionaries: response.data.data.total); // Adjust based on the actual response structure for public API
//       setPage(response.data.data.pagination ?response.data.data.pagination.currentPage - 1 :response.data.data.page - 1); // Adjust based on the actual response structure for public API
//     } catch (error) {
//       console.error("Failed to fetch missionaries:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       loadMissionaries({ newPage: 0, newRowsPerPage: rowsPerPage, search: filters.search, sortField, sortOrder });
//       if (user.role === "npo_admin") {
//         const fetchBases = async () => {
//           try {
//             const response = await getBases();
//             setBases(response.data.data);
//           } catch (error) {
//             console.error("Failed to fetch bases:", error);
//           }
//         };
//         fetchBases();
//       }
//     }
//   }, [user?.role, rowsPerPage]);

//   const handleSortChange = (field) => {
//     const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
//     setSortField(field);
//     setSortOrder(newSortOrder);
//     loadMissionaries({ newPage: page, newRowsPerPage: rowsPerPage, search: filters.search, sortField: field, sortOrder: newSortOrder });
//   };

//   const handleBlock = async (row) => {
//     if (
//       window.confirm(`Are you sure you want to block ${row.userId.firstName}?`)
//     ) {
//       await blockMissionary(row._id);
//       loadMissionaries();
//     }
//   };

//   const handleUnblock = async (row) => {
//     if (
//       window.confirm(
//         `Are you sure you want to unblock ${row.userId.firstName}?`
//       )
//     ) {
//       await unblockMissionary(row._id);
//       loadMissionaries();
//     }
//   };

//   const columns = [
//     {
//       field: "userId.firstName",
//       headerName: "Missionaries Name",
//       render: (value, row) =>
//         `${row.userId?.firstName} ${row.userId?.lastName}`,
//       sortable: true,
//     },
//     {
//       field: "baseId.location",
//       headerName: "Base Location",
//       render: (value, row) => row.baseId?.location || "N/A",
//       sortable: true,
//     },
//     {
//       field: "createdAt",
//       headerName: "Registered",
//       render: (value) => new Date(value).toLocaleDateString(),
//       sortable: true,
//     },
//     {
//       field: "isActive",
//       headerName: "Status",
//       render: (value) => (value ? "Active" : "Inactive"),
//       sortable: true,
//     },
//     {
//       field: "userId.email",
//       headerName: "Email",
//       render: (value, row) => row.userId?.email,
//       sortable: true,
//     },
//   ];

//   const actions = [
//     { label: "View", icon: <VisibilityIcon /> /* onClick: () => {} */ },
//     {
//       label: "Block",
//       icon: <BlockIcon color="warning" />,
//       onClick: handleBlock,
//       shouldRender: (row) => row.isActive,
//     },
//     {
//       label: "Unblock",
//       icon: <LockOpenIcon color="info" />,
//       onClick: handleUnblock,
//       shouldRender: (row) => !row.isActive,
//     },
//   ];

//   const handleChangePage = (event, newPage) => {
//     loadMissionaries({ newPage, newRowsPerPage: rowsPerPage, search: filters.search, sortField, sortOrder });
//   };

//   const handleChangeRowsPerPage = (event) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     setRowsPerPage(newRowsPerPage);
//     loadMissionaries({ newPage: 0, newRowsPerPage, search: filters.search, sortField, sortOrder });
//   };

//   const handleSearchChange = (event) => {
//     setFilters(prev => ({ ...prev, search: event.target.value }));
//   };

//   const handleSearchSubmit = (searchQuery) => {
//     loadMissionaries({ newPage: 0, newRowsPerPage: rowsPerPage, search: searchQuery, sortField, sortOrder });
//   };

//   const filteredMissionaries = missionaries;

//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         sx={{ mb: 3 }}
//       >
//         <Typography variant="h4" fontWeight={600}>
//           Missionaries
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setIsModalOpen(true)}
//           sx={{
//             ":hover": {
//               backgroundColor: "primary.light",
//             },
//           }}
//         >
//           Add
//         </Button>
//       </Stack>

//       <GenericTable
//         columns={columns}
//         data={filteredMissionaries}
//         actions={actions}
//         isLoading={loading}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         total={total}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         onSearch={handleSearchSubmit}
//         onSortChange={handleSortChange}
//         sortField={sortField}
//         sortOrder={sortOrder}
//       />

//       <AddMissionaryModal
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onAdd={() => loadMissionaries()}
//         role={user?.role}
//         bases={bases}
//       />
//     </Box>
//   );
// };

// export default MissionariesPage;
import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import GenericTable from "../genricCompoennts/GenericTable";
import {
  getMissionaries,
  blockMissionary,
  unblockMissionary,
  getPublicMissionaries
} from "../services/missionary.service";
import AddMissionaryModal from "../modals/AddMissionaryModal";
import { useAuth } from "../contexts/AuthContext";
import { getBases } from "../services/base.service";
import { format } from "date-fns";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssignBaseModal from "../modals/AssignBaseModal";
const MissionariesPage = () => {
  const [missionaries, setMissionaries] = useState([]); // Stores paginated data from backend
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const [bases, setBases] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMissionary, setSelectedMissionary] = useState(null);
  // Backend pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0); // Total count from backend

  // Backend search state (managed by MissionariesPage, passed to GenericTable)
  const [searchQuery, setSearchQuery] = useState("");

  // Frontend sorting states (managed by MissionariesPage, passed to GenericTable for display and trigger)
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Function to load missionaries with pagination and search parameters for backend
  const loadMissionaries = async (options = {}) => {
    setLoading(true);
    try {
      const {
        newPage = page,
        newRowsPerPage = rowsPerPage,
        search = searchQuery,
      } = options;

      let response;
      const params = {
        page: newPage + 1,
        limit: newRowsPerPage,
        search,
        // Removed sortField and sortOrder from params as sorting is now frontend
      };

      if (user?.role === "super_admin") {
        response = await getPublicMissionaries(params);
      } else {
        response = await getMissionaries(params);
      }

      setMissionaries(response.data.data.data || []);
      setTotal(response.data.data.pagination ? response.data.data.pagination.totalMissionaries : response.data.data.total);
      setPage(response.data.data.pagination ? response.data.data.pagination.currentPage - 1 : response.data.data.page - 1);
    } catch (error) {
      console.error("Failed to fetch missionaries:", error);
      setMissionaries([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Initial load with current states for pagination and search
      loadMissionaries({ newPage: page, newRowsPerPage: rowsPerPage, search: searchQuery });
      if (user.role === "npo_admin") {
        const fetchBases = async () => {
          try {
            const response = await getBases();
            setBases(response.data.data);
          } catch (error) {
            console.error("Failed to fetch bases:", error);
          }
        };
        fetchBases();
      }
    }
  }, [user?.role, page, rowsPerPage, searchQuery]); // Re-fetch when these states change (excluding sortField/sortOrder)

  // Frontend sorting logic applied to the `missionaries` data (current page's data)
  const sortedMissionaries = useMemo(() => {
    let currentData = Array.isArray(missionaries) ? [...missionaries] : [];

    if (sortField) {
      currentData.sort((a, b) => {
        let aValue, bValue;

        // Handle nested fields for sorting
        if (sortField === "userId.firstName") {
          aValue = `${a.userId?.firstName || ''} ${a.userId?.lastName || ''}`;
          bValue = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`;
        } else if (sortField === "baseId.location") {
          aValue = a.baseId?.location;
          bValue = b.baseId?.location;
        } else if (sortField === "userId.email") {
          aValue = a.userId?.email;
          bValue = b.userId?.email;
        } else {
          aValue = a[sortField];
          bValue = b[sortField];
        }

        // Ensure values are not null/undefined before comparison
        aValue = aValue === undefined || aValue === null ? "" : aValue;
        bValue = bValue === undefined || bValue === null ? "" : bValue;

        // Type-specific comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue, undefined, { sensitivity: 'base' })
            : bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        if (sortField === "createdAt") { // Special handling for date strings
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }
        // Fallback for other types
        return 0;
      });
    }
    return currentData;
  }, [missionaries, sortField, sortOrder]); // Dependencies for re-calculation

  const handleSearch = (searchVal) => {
    setSearchQuery(searchVal);
    setPage(0); // Reset to first page on new search
    // loadMissionaries will be triggered by useEffect due to searchQuery change
  };

  const handleSortChange = (field) => {
    const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    // No need to reset page or call loadMissionaries here, useMemo handles sorting
  };

  const handleBlock = async (row) => {
    if (
      window.confirm(`Are you sure you want to block ${row.userId.firstName}?`)
    ) {
      await blockMissionary(row._id);
      loadMissionaries(); // Reload current page data after action
    }
  };

  const handleUnblock = async (row) => {
    if (
      window.confirm(
        `Are you sure you want to unblock ${row.userId.firstName}?`
      )
    ) {
      await unblockMissionary(row._id);
      loadMissionaries(); // Reload current page data after action
    }
  };

   const handleOpenAssignModal = (missionary) => {
    setSelectedMissionary(missionary);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setSelectedMissionary(null);
    setIsAssignModalOpen(false);
  };

  const columns = [
    {
      field: "userId.firstName",
      headerName: "Missionaries Name",
      render: (value, row) =>
        `${row.userId?.firstName || ''} ${row.userId?.lastName || ''}`,
      sortable: true,
    },
    {
      field: "baseId.location",
      headerName: "Base Location",
      render: (value, row) => row.baseId?.location || "N/A",
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: "Registered",
      render: (value, row) => {
      // Check if row.userId and row.userId.createdAt exist, otherwise use row.createdAt
      const dateToRender = row.userId?.createdAt ? row.userId.createdAt : row.createdAt;
      return dateToRender ? format(new Date(dateToRender), "dd/MM/yyyy") : "N/A";
    },

      // render: (value, row) => row.userId?.createdAt ? format(new Date(row.userId.createdAt), "dd/MM/yyyy") : "N/A",
      // render: (value) => value ? format(new Date(value), "dd/MM/yyyy") : "N/A",
      sortable: true,
    },
    {
      field: "userId.isActive",
      headerName: "Status",
      // render: (value) => (value ? "Active" : "Inactive"),
      render: (value, row) => (row.userId?.isActive ? "Inactive" : "Active"),
      sortable: true,
    },
    {
      field: "userId.email",
      headerName: "Email",
      render: (value, row) => row.userId?.email || "N/A",
      sortable: true,
    },
  ];

  const actions = [
    { label: "View", icon: <VisibilityIcon /> /* onClick: () => {} */ },
    {
      label: "Assign Base",
      icon: <WarningAmberIcon color="warning" />,
      onClick: handleOpenAssignModal,
      shouldRender: (row) => !row.baseId, // Only show if baseId is missing
    },
    {
      label: "Block",
      icon: <BlockIcon color="warning" />,
      onClick: handleBlock,
      shouldRender: (row) => row.isActive,
    },
    {
      label: "Unblock",
      icon: <LockOpenIcon color="info" />,
      onClick: handleUnblock,
      shouldRender: (row) => !row.isActive,
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // loadMissionaries will be triggered by useEffect due to page change
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
    // loadMissionaries will be triggered by useEffect due to rowsPerPage change
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight={600}>
          Missionaries
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            ":hover": {
              backgroundColor: "primary.light",
            },
          }}
        >
          Add
        </Button>
      </Stack>

      <GenericTable
        columns={columns}
        data={sortedMissionaries} // Pass the sorted data to GenericTable
        actions={actions}
        isLoading={loading}
        page={page} // Pass current page to GenericTable
        rowsPerPage={rowsPerPage} // Pass rows per page to GenericTable
        total={total} // Pass total count from backend to GenericTable for overall pagination display
        onPageChange={handleChangePage} // Pass backend page change handler
        onRowsPerPageChange={handleChangeRowsPerPage} // Pass backend rows per page change handler
        onSearch={handleSearch} // Pass the search handler to GenericTable
        onSortChange={handleSortChange} // Pass the sort handler to GenericTable
        sortField={sortField} // Pass the current sort field
        sortOrder={sortOrder} // Pass the current sort order
      />

      <AddMissionaryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={() => loadMissionaries()} // Reload current data after adding
        role={user?.role}
        bases={bases}
      />

       {selectedMissionary && (
        <AssignBaseModal
            open={isAssignModalOpen}
            onClose={handleCloseAssignModal}
            onAssign={() => {
                handleCloseAssignModal();
                loadMissionaries(); // Reload the list after assigning
            }}
            missionary={selectedMissionary}
            bases={bases}
        />
      )}
    </Box>
  );
};

export default MissionariesPage;
