// import React, { useState, useEffect } from "react";
// import { Typography, Box, Stack } from "@mui/material";
// import GenericTable from "../genricCompoennts/GenericTable";
// import DoneIcon from "@mui/icons-material/Done";
// import ClearIcon from "@mui/icons-material/Clear";
// import BlockIcon from '@mui/icons-material/Block';
// import LockOpenIcon from '@mui/icons-material/LockOpen';
// import { useNavigate } from "react-router-dom";
// import { format } from "date-fns";
// import { fetchOrganizations, approveOrganization, rejectOrganization, blockOrganization, unblockOrganization } from '../services/organizationService';

// const NposPage = () => {
//     const navigate = useNavigate();
//     const [npos, setNpos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [total, setTotal] = useState(0);
//     const [sortField, setSortField] = useState("");  // state for sort field
//     const [sortOrder, setSortOrder] = useState("asc");  // state for sort order

//     const loadNpos = async (newPage = page, newRowsPerPage = rowsPerPage, search, sortField, sortOrder) => {
//         setLoading(true);
//         try {
//             const response = await fetchOrganizations(newPage + 1, newRowsPerPage, search, sortField, sortOrder);  
//             setNpos(response.data.data.data);
//             setTotal(response.data.data.total);
//             setPage(response.data.data.page - 1);  
//         } catch (error) {
//             console.error("Failed to fetch NPOs:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadNpos(0, rowsPerPage);
//     }, []);

//     // const handleSortChange = (field) => {
//     //     setSortField(field);
//     //     setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
//     //     loadNpos(page, rowsPerPage, "", field, sortOrder);
//     // };
//     const handleSortChange = (field) => {
//     const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
//     setSortField(field);
//     setSortOrder(newSortOrder);
//     loadNpos(page, rowsPerPage, "", field, newSortOrder); 
// };


//     const handleApprove = async (row) => {
//         if (window.confirm(`Are you sure you want to approve "${row.name}"? This will send their login credentials.`)) {
//             try {
//                 await approveOrganization(row._id);
//                 loadNpos(page, rowsPerPage, "", sortField, sortOrder); 
//             } catch (error) {
//                 console.error("Failed to approve organization:", error);
//                 alert("Failed to approve organization.");
//             }
//         }
//     };

//     const handleReject = async (row) => {
//         if (window.confirm(`Are you sure you want to REJECT "${row.name}"?`)) {
//             await rejectOrganization(row._id);
//             loadNpos(page, rowsPerPage, "", sortField, sortOrder);
//         }
//     };

//     const handleBlock = async (row) => {
//         if (window.confirm(`Are you sure you want to BLOCK "${row.name}"?`)) {
//             await blockOrganization(row._id);
//             loadNpos(page, rowsPerPage, "", sortField, sortOrder);
//         }
//     };

//     const handleUnblock = async (row) => {
//         if (window.confirm(`Are you sure you want to UNBLOCK "${row.name}"?`)) {
//             await unblockOrganization(row._id);
//             loadNpos(page, rowsPerPage, "", sortField, sortOrder);
//         }
//     };

//     const columns = [
//         { field: "name", headerName: "OrgName", sortable: true },
//         { field: "email", headerName: "Org Email", sortable: true },
//         {
//             field: "createdAt",
//             headerName: "Registered",
//             render: (value) => {
//                 const date = new Date(value);
//                 return format(date, "dd/MM/yyyy"); 
//             },
//             sortable: true
//         },
//         { field: "status", headerName: "Status", sortable: true },
//         { field: "domainSlug", headerName: "Domain Name", sortable: true },
//     ];

//     const actions = [
//         {
//             label: "Approve",
//             icon: <DoneIcon color="success" />,
//             onClick: handleApprove,
//             shouldRender: (row) => row.status === 'pending_approval',
//         },
//         {
//             label: "Reject",
//             icon: <ClearIcon color="error" />,
//             onClick: handleReject,
//             shouldRender: (row) => row.status === 'pending_approval',
//         },
//         {
//             label: "Block",
//             icon: <BlockIcon color="warning" />,
//             onClick: handleBlock,
//             shouldRender: (row) => row.status === 'active' && !row.isBlocked,
//         },
//         {
//             label: "Unblock",
//             icon: <LockOpenIcon color="info" />,
//             onClick: handleUnblock,
//             shouldRender: (row) => row.status === 'active' && row.isBlocked,
//         },
//     ];

//     const handleChangePage = (event, newPage) => {
//         loadNpos(newPage, rowsPerPage, "", sortField, sortOrder);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         const newRowsPerPage = parseInt(event.target.value, 10);
//         setRowsPerPage(newRowsPerPage);
//         loadNpos(0, newRowsPerPage, "", sortField, sortOrder);
//     };

//     return (
//         <Box>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
//                 <Typography variant="h4" fontWeight={600}>Manage NPOs</Typography>
//             </Stack>
//             <GenericTable
//                 columns={columns}
//                 data={npos}
//                 actions={actions}
//                 isLoading={loading}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 total={total}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 onSearch={search => loadNpos(0, rowsPerPage, search, sortField, sortOrder)}
//                 onSortChange={handleSortChange} 
//                 sortField={sortField}
//                 sortOrder={sortOrder}
//             />
//         </Box>
//     );
// };

// export default NposPage;
// import React, { useState, useEffect } from "react";
// import { Typography, Box, Stack } from "@mui/material";
// import GenericTable from "../genricCompoennts/GenericTable";
// import DoneIcon from "@mui/icons-material/Done";
// import ClearIcon from "@mui/icons-material/Clear";
// import BlockIcon from '@mui/icons-material/Block';
// import LockOpenIcon from '@mui/icons-material/LockOpen';
// import { useNavigate } from "react-router-dom";
// import { format } from "date-fns";
// import { fetchOrganizations, approveOrganization, rejectOrganization, blockOrganization, unblockOrganization } from '../services/organizationService';

// const NposPage = () => {
//     const navigate = useNavigate();
//     const [npos, setNpos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(0); // Keep for backend pagination if needed
//     const [rowsPerPage, setRowsPerPage] = useState(10); // Keep for backend pagination if needed
//     const [total, setTotal] = useState(0); // Keep for backend pagination if needed

//     // The sortField and sortOrder states are no longer needed here as sorting is frontend
//     // const [sortField, setSortField] = useState("");
//     // const [sortOrder, setSortOrder] = useState("asc");

//     const loadNpos = async (newPage = page, newRowsPerPage = rowsPerPage, search = "") => { // Removed sortField, sortOrder parameters
//         setLoading(true);
//         try {
//             // Only pass pagination and search to backend, sorting is now frontend
//             const response = await fetchOrganizations(newPage + 1, newRowsPerPage, search);
//             setNpos(response.data.data.data);
//             setTotal(response.data.data.total);
//             setPage(response.data.data.page - 1);
//         } catch (error) {
//             console.error("Failed to fetch NPOs:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadNpos(0, rowsPerPage);
//     }, []);

//     // Removed handleSortChange as sorting is now handled internally by GenericTable
//     // const handleSortChange = (field) => {
//     //     const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
//     //     setSortField(field);
//     //     setSortOrder(newSortOrder);
//     //     loadNpos(page, rowsPerPage, "", field, newSortOrder);
//     // };


//     const handleApprove = async (row) => {
//         // Using a custom modal/dialog instead of window.confirm for better UX and consistency
//         // For this example, I'll use a simple console.log, but you should replace with a proper UI
//         if (window.confirm(`Are you sure you want to approve "${row.name}"? This will send their login credentials.`)) {
//             try {
//                 await approveOrganization(row._id);
//                 // Reload data after action. No need to pass sort or search parameters
//                 loadNpos(page, rowsPerPage);
//             } catch (error) {
//                 console.error("Failed to approve organization:", error);
//                 // Use a proper UI notification instead of alert
//                 // alert("Failed to approve organization.");
//                 console.log("Failed to approve organization.");
//             }
//         }
//     };

//     const handleReject = async (row) => {
//         if (window.confirm(`Are you sure you want to REJECT "${row.name}"?`)) {
//             try {
//                 await rejectOrganization(row._id);
//                 loadNpos(page, rowsPerPage);
//             } catch (error) {
//                 console.error("Failed to reject organization:", error);
//             }
//         }
//     };

//     const handleBlock = async (row) => {
//         if (window.confirm(`Are you sure you want to BLOCK "${row.name}"?`)) {
//             try {
//                 await blockOrganization(row._id);
//                 loadNpos(page, rowsPerPage);
//             } catch (error) {
//                 console.error("Failed to block organization:", error);
//             }
//         }
//     };

//     const handleUnblock = async (row) => {
//         if (window.confirm(`Are you sure you want to UNBLOCK "${row.name}"?`)) {
//             try {
//                 await unblockOrganization(row._id);
//                 loadNpos(page, rowsPerPage);
//             } catch (error) {
//                 console.error("Failed to unblock organization:", error);
//             }
//         }
//     };

//     const columns = [
//         { field: "name", headerName: "OrgName", sortable: true },
//         { field: "email", headerName: "Org Email", sortable: true },
//         {
//             field: "createdAt",
//             headerName: "Registered",
//             render: (value) => {
//                 // Ensure value is a valid date before formatting
//                 const date = value ? new Date(value) : null;
//                 return date && !isNaN(date) ? format(date, "dd/MM/yyyy") : "N/A";
//             },
//             sortable: true
//         },
//         { field: "status", headerName: "Status", sortable: true },
//         { field: "domainSlug", headerName: "Domain Name", sortable: true },
//     ];

//     const actions = [
//         {
//             label: "Approve",
//             icon: <DoneIcon color="success" />,
//             onClick: handleApprove,
//             shouldRender: (row) => row.status === 'pending_approval',
//         },
//         {
//             label: "Reject",
//             icon: <ClearIcon color="error" />,
//             onClick: handleReject,
//             shouldRender: (row) => row.status === 'pending_approval',
//         },
//         {
//             label: "Block",
//             icon: <BlockIcon color="warning" />,
//             onClick: handleBlock,
//             shouldRender: (row) => row.status === 'active' && !row.isBlocked,
//         },
//         {
//             label: "Unblock",
//             icon: <LockOpenIcon color="info" />,
//             onClick: handleUnblock,
//             shouldRender: (row) => row.status === 'active' && row.isBlocked,
//         },
//     ];

//     // These handlers are still relevant if you want to fetch new pages from the backend
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage); // Update parent's page state
//         loadNpos(newPage, rowsPerPage); // Fetch data for the new page
//     };

//     return (
//         <Box>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
//                 <Typography variant="h4" fontWeight={600}>Manage NPOs</Typography>
//             </Stack>
//             {/* <GenericTable
//                 columns={columns}
//                 data={npos} // Pass the raw data fetched from backend
//                 actions={actions}
//                 isLoading={loading}
//                 // Removed page, rowsPerPage, total, onSearch, onSortChange, sortField, sortOrder from props
//                 // as they are now managed internally by GenericTable for frontend operations.
//                 // However, if the parent component (NposPage) still needs to control backend pagination,
//                 // you can keep passing onPageChange and onRowsPerPageChange.
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             /> */}
//             <GenericTable
//                 columns={columns}
//                 data={npos}
//                 actions={actions}
//                 isLoading={loading}
//                 onSearch={search => loadNpos(0, rowsPerPage, search)}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 total={total}
//                 onPageChange={handleChangePage}
                
//             />
//         </Box>
//     );
// };

// export default NposPage;
import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
import { Typography, Box, Stack } from "@mui/material";
import GenericTable from "../genricCompoennts/GenericTable";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fetchOrganizations, approveOrganization, rejectOrganization, blockOrganization, unblockOrganization } from '../services/organizationService';

const NposPage = () => {
    const navigate = useNavigate();
    const [npos, setNpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortField, setSortField] = useState("");  // State for sort field
    const [sortOrder, setSortOrder] = useState("asc");  // State for sort order

    const loadNpos = async (newPage = page, newRowsPerPage = rowsPerPage, search = "") => {
        setLoading(true);
        try {
            const response = await fetchOrganizations(newPage + 1, newRowsPerPage, search);
            setNpos(response.data.data.data);
            setTotal(response.data.data.total);
            setPage(response.data.data.page - 1);
        } catch (error) {
            console.error("Failed to fetch NPOs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNpos(0, rowsPerPage, "");
    }, []);

    const handleSortChange = (field) => {
        const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newSortOrder);
        // No need to call loadNpos here, as sorting is now applied to the existing `npos` data
    };

    const handleApprove = async (row) => {
        if (window.confirm(`Are you sure you want to approve "${row.name}"? This will send their login credentials.`)) {
            try {
                await approveOrganization(row._id);
                loadNpos(page, rowsPerPage);
            } catch (error) {
                console.error("Failed to approve organization:", error);
                console.log("Failed to approve organization.");
            }
        }
    };

    const handleReject = async (row) => {
        if (window.confirm(`Are you sure you want to REJECT "${row.name}"?`)) {
            try {
                await rejectOrganization(row._id);
                loadNpos(page, rowsPerPage);
            } catch (error) {
                console.error("Failed to reject organization:", error);
            }
        }
    };

    const handleBlock = async (row) => {
        if (window.confirm(`Are you sure you want to BLOCK "${row.name}"?`)) {
            try {
                await blockOrganization(row._id);
                loadNpos(page, rowsPerPage);
            } catch (error) {
                console.error("Failed to block organization:", error);
            }
        }
    };

    const handleUnblock = async (row) => {
        if (window.confirm(`Are you sure you want to UNBLOCK "${row.name}"?`)) {
            try {
                await unblockOrganization(row._id);
                loadNpos(page, rowsPerPage);
            } catch (error) {
                console.error("Failed to unblock organization:", error);
            }
        }
    };

    const columns = [
        { field: "name", headerName: "OrgName", sortable: true },
        { field: "email", headerName: "Org Email", sortable: true },
        {
            field: "createdAt",
            headerName: "Registered",
            render: (value) => {
                const date = value ? new Date(value) : null;
                return date && !isNaN(date) ? format(date, "dd/MM/yyyy") : "N/A";
            },
            sortable: true
        },
        { field: "status", headerName: "Status", sortable: true },
        { field: "domainSlug", headerName: "Domain Name", sortable: true },
    ];

    const actions = [
        {
            label: "Approve",
            icon: <DoneIcon color="success" />,
            onClick: handleApprove,
            shouldRender: (row) => row.status === 'pending_approval',
        },
        {
            label: "Reject",
            icon: <ClearIcon color="error" />,
            onClick: handleReject,
            shouldRender: (row) => row.status === 'pending_approval',
        },
        {
            label: "Block",
            icon: <BlockIcon color="warning" />,
            onClick: handleBlock,
            shouldRender: (row) => row.status === 'active' && !row.isBlocked,
        },
        {
            label: "Unblock",
            icon: <LockOpenIcon color="info" />,
            onClick: handleUnblock,
            shouldRender: (row) => row.status === 'active' && row.isBlocked,
        },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadNpos(newPage, rowsPerPage);
    };

    // Function to get nested property value (copied from GenericTable for consistency)
    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Implement client-side sorting using useMemo
    const sortedNpos = useMemo(() => {
        let currentNpos = Array.isArray(npos) ? [...npos] : [];

        if (sortField) {
            currentNpos.sort((a, b) => {
                const aValue = getNestedValue(a, sortField); // Use getNestedValue for potentially nested fields
                const bValue = getNestedValue(b, sortField);

                // Handle null/undefined values
                if (aValue === null || aValue === undefined) return sortOrder === 'asc' ? 1 : -1;
                if (bValue === null || bValue === undefined) return sortOrder === 'asc' ? -1 : 1;

                // Type-specific comparison
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortOrder === 'asc'
                        ? aValue.localeCompare(bValue, undefined, { sensitivity: 'base' })
                        : bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortOrder === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                } else if (aValue instanceof Date && bValue instanceof Date) {
                    return sortOrder === 'asc'
                        ? aValue.getTime() - bValue.getTime()
                        : bValue.getTime() - aValue.getTime();
                } else {
                    // Fallback for other types or mixed types: convert to string
                    const aString = String(aValue);
                    const bString = String(bValue);
                    return sortOrder === 'asc'
                        ? aString.localeCompare(bString)
                        : bString.localeCompare(aString);
                }
            });
        }
        return currentNpos;
    }, [npos, sortField, sortOrder]); // Dependencies: npos data, current sort field, current sort order


    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>Manage NPOs</Typography>
            </Stack>
            <GenericTable
                columns={columns}
                data={sortedNpos} // Pass the sorted data to GenericTable
                actions={actions}
                isLoading={loading}
                onSearch={search => loadNpos(0, rowsPerPage, search)}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                onPageChange={handleChangePage}
                onSortChange={handleSortChange} // Pass the handleSortChange to GenericTable
                sortField={sortField}           // Pass the sortField state
                sortOrder={sortOrder}           // Pass the sortOrder state
            />
        </Box>
    );
};

export default NposPage;