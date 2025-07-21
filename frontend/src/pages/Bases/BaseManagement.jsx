// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   TextField,
//   Modal,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { addBaseUser, getBases } from "../../services/base.service";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 450,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
// };
// const BasePage = () => {
//   const [bases, setBases] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     location: "",
//   });

//   const fetchBases = async () => {
//     const response = await getBases();
//     setBases(response.data.data);
//   };

//   useEffect(() => {
//     fetchBases();
//   }, []);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addBaseUser(form);
//       handleClose();
//       fetchBases();
//     } catch (error) {
//       console.error("Failed to create base user", error);
//     }
//   };

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="h4">Manage Bases</Typography>
//         <Button variant="contained" onClick={handleOpen}>
//           Add New Base
//         </Button>
//       </Box>
//       <Typography sx={{ mt: 2 }}>
//         A list of your organization's bases.
//       </Typography>
//       <List>
//         {bases.map((base) => (
//           <ListItem key={base._id}>
//             <ListItemText
//               primary={base.location}
//               secondary={`${base.firstName} ${base.lastName} - ${base.email}`}
//             />
//           </ListItem>
//         ))}
//       </List>

//       <Modal open={open} onClose={handleClose}>
//         <Box sx={style} component="form" onSubmit={handleSubmit}>
//           <Typography variant="h6">Create New Base User</Typography>
//           <TextField
//             name="firstName"
//             label="First Name"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="lastName"
//             label="Last Name"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="email"
//             label="Email"
//             type="email"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="password"
//             label="Password"
//             type="password"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="location"
//             label="Base Location (e.g., 'Lucknow, India')"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//             Create Base
//           </Button>
//         </Box>
//       </Modal>
//     </Paper>
//   );
// };

// export default BasePage;
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   TextField,
//   Modal,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import GenericTable from "../../genricCompoennts/GenericTable";
// import { addBaseUser, getBases } from "../../services/base.service";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 450,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
// };

// const BasePage = () => {
//   const [bases, setBases] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     location: "",
//   });

//   const fetchBases = async () => {
//     try {
//       const response = await getBases();
//       setBases(response.data.data);
//     } catch (error) {
//       console.error("Error fetching bases:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBases();
//   }, []);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addBaseUser(form);
//       handleClose();
//       fetchBases(); // Refresh after adding
//     } catch (error) {
//       console.error("Failed to create base user", error);
//     }
//   };

//   const columns = [
//     { field: "location", headerName: "Location" },
//     { field: "firstName", headerName: "First Name" },
//     { field: "lastName", headerName: "Last Name" },
//     { field: "email", headerName: "Email" },
//   ];

//   const actions = [
//     {
//       label: "Edit",
//       icon: <EditIcon fontSize="small" />,
//       onClick: (row) => console.log("Edit clicked:", row),
//     },
//     {
//       label: "Delete",
//       icon: <DeleteIcon fontSize="small" />,
//       onClick: (row) => console.log("Delete clicked:", row),
//     },
//   ];

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="h4">Manage Bases</Typography>
//         <Button variant="contained" onClick={handleOpen}>
//           Add New Base
//         </Button>
//       </Box>

//       <Typography sx={{ mt: 2 }}>
//         A list of your organization's bases.
//       </Typography>

//       <Box sx={{ mt: 3 }}>
//         <GenericTable
//           columns={columns}
//           data={bases}
//           actions={actions}
//           isLoading={false} // Optional: replace with a loading state if needed
//         />
//       </Box>

//       <Modal open={open} onClose={handleClose}>
//         <Box sx={style} component="form" onSubmit={handleSubmit}>
//           <Typography variant="h6">Create New Base User</Typography>
//           <TextField
//             name="firstName"
//             label="First Name"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="lastName"
//             label="Last Name"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="email"
//             label="Email"
//             type="email"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="password"
//             label="Password"
//             type="password"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="location"
//             label="Base Location (e.g., 'Lucknow, India')"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//             Create Base
//           </Button>
//         </Box>
//       </Modal>
//     </Paper>
//   );
// };

// export default BasePage;

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   TextField,
//   Modal,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import GenericTable from "../../genricCompoennts/GenericTable";
// import { addBaseUser, getBases } from "../../services/base.service";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 450,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
// };

// const BasePage = () => {
//   const [bases, setBases] = useState([]); // Stores paginated and searched data from backend
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     location: "",
//   });
//   const [loading, setLoading] = useState(true);

//   // Backend Pagination States
//   const [page, setPage] = useState(0); // 0-indexed for frontend, convert to 1-indexed for API
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [total, setTotal] = useState(0); // Total count from backend

//   // Backend Search State
//   const [searchQuery, setSearchQuery] = useState("");

//   // Frontend Sorting States
//   const [sortField, setSortField] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");

//   const fetchBases = async (options = {}) => {
//     setLoading(true);
//     try {
//       const {
//         newPage = page,
//         newRowsPerPage = rowsPerPage,
//         search = searchQuery,
//       } = options;

//       const response = await getBases({
//         page: newPage + 1, 
//         limit: newRowsPerPage,
//         search,
//       });
//       console.log("============----------------->>>>>>>>", response?.data)
//       setBases(response?.data?.data?.data); // Assuming response.data.data contains the array of bases
//       setTotal(response.data.pagination.totalBases); // Assuming response.data.pagination.totalBases is the total count
//       setPage(response.data.pagination.currentPage - 1); // Convert back to 0-indexed for frontend state
//     } catch (error) {
//       console.error("Error fetching bases:", error);
//       setBases([]); // Ensure bases is an array on error
//       setTotal(0);
//       setPage(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBases({ newPage: page, newRowsPerPage: rowsPerPage, search: searchQuery });
//   }, [page, rowsPerPage, searchQuery]);
//   useEffect(() => {
//     console.log("Fetched Bases Data: ", bases); // Add this to log the data you are passing
//   }, [bases]);

//   // Frontend sorting logic applied to the 'bases' data (which is already paginated and searched by backend)
//   const sortedBases = useMemo(() => {
//     let currentData = Array.isArray(bases) ? [...bases] : [];

//     if (sortField) {
//       currentData.sort((a, b) => {
//         let aValue, bValue;

//         // Helper function to get nested property value (if needed for future fields)
//         const getNestedValue = (obj, path) => {
//           return path.split('.').reduce((acc, part) => acc && acc[part], obj);
//         };

//         // For simple top-level fields like location, firstName, lastName, email
//         aValue = getNestedValue(a, sortField);
//         bValue = getNestedValue(b, sortField);

//         // Ensure values are not null/undefined before comparison
//         aValue = aValue === undefined || aValue === null ? "" : aValue;
//         bValue = bValue === undefined || bValue === null ? "" : bValue;

//         // Type-specific comparison
//         if (typeof aValue === 'string' && typeof bValue === 'string') {
//           return sortOrder === 'asc'
//             ? aValue.localeCompare(bValue, undefined, { sensitivity: 'base' })
//             : bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
//         }
//         if (typeof aValue === 'number' && typeof bValue === 'number') {
//           return sortOrder === 'asc'
//             ? aValue - bValue
//             : bValue - aValue;
//         }
//         // If there were date fields to sort, you'd add:
//         // if (sortField === "createdAt") {
//         //   const dateA = new Date(aValue);
//         //   const dateB = new Date(bValue);
//         //   return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
//         // }
//         return 0; // Fallback
//       });
//     }
//     return currentData;
//   }, [bases, sortField, sortOrder]); // Dependencies for re-calculation

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addBaseUser(form);
//       handleClose();
//       fetchBases(); // Refresh current page after adding
//     } catch (error) {
//       console.error("Failed to create base user", error);
//     }
//   };

//   // Pagination Handlers (trigger backend fetch)
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to first page when rows per page changes
//   };

//   // Search Handler (trigger backend fetch)
//   const handleSearch = (searchVal) => {
//     setSearchQuery(searchVal);
//     setPage(0); // Reset to first page on new search
//   };

//   // Sort Handler (trigger frontend sort)
//   const handleSortChange = (field) => {
//     const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
//     setSortField(field);
//     setSortOrder(newSortOrder);
//     // Sorting is handled by useMemo, no need to call fetchBases here
//   };

//   const columns = [
//     { field: "location", headerName: "Location", sortable: true },
//     { field: "firstName", headerName: "First Name", sortable: true },
//     { field: "lastName", headerName: "Last Name", sortable: true },
//     { field: "email", headerName: "Email", sortable: true },
//     // Add createdAt if available in your base user data and you want to display/sort it
//     // { field: "createdAt", headerName: "Created At", render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A', sortable: true },
//   ];

//   const actions = [
//     {
//       label: "Edit",
//       icon: <EditIcon fontSize="small" />,
//       onClick: (row) => console.log("Edit clicked:", row),
//     },
//     {
//       label: "Delete",
//       icon: <DeleteIcon fontSize="small" />,
//       onClick: (row) => console.log("Delete clicked:", row),
//     },
//   ];

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="h4">Manage Bases</Typography>
//         <Button variant="contained" onClick={handleOpen}>
//           Add New Base
//         </Button>
//       </Box>

//       {/* <Typography sx={{ mt: 2 }}>
//         A list of your organization's bases.
//       </Typography> */}

//       <Box sx={{ mt: 3 }}>
//         <GenericTable
//           columns={columns}
//           data={sortedBases} // Pass the sorted data
//           actions={actions}
//           isLoading={loading}
//           page={page} // Pass backend page
//           rowsPerPage={rowsPerPage} // Pass backend rows per page
//           total={total} // Pass backend total count
//           onPageChange={handleChangePage} // Pass backend pagination handler
//           onRowsPerPageChange={handleChangeRowsPerPage} // Pass backend rows per page handler
//           onSearch={handleSearch} // Pass backend search handler
//           onSortChange={handleSortChange} // Pass frontend sort handler
//           sortField={sortField} // Pass current sort field
//           sortOrder={sortOrder} // Pass current sort order
//         />
//       </Box>

//       <Modal open={open} onClose={handleClose}>
//         <Box sx={style} component="form" onSubmit={handleSubmit}>
//           <Typography variant="h6">Create New Base User</Typography>
//           <TextField
//             name="firstName"
//             label="First Name"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="lastName"
//             label="Last Name"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="email"
//             label="Email"
//             type="email"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="password"
//             label="Password"
//             type="password"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="location"
//             label="Base Location (e.g., 'Lucknow, India')"
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//             Create Base
//           </Button>
//         </Box>
//       </Modal>
//     </Paper>
//   );
// };

// export default BasePage;
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericTable from "../../genricCompoennts/GenericTable";
import { addBaseUser, getBases } from "../../services/base.service";
import { format } from "date-fns"; // Import format for date rendering

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const BasePage = () => {
  const [bases, setBases] = useState([]); // Stores paginated and searched data from backend
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  // Backend Pagination States
  const [page, setPage] = useState(0); // 0-indexed for frontend, convert to 1-indexed for API
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0); // Total count from backend

  // Backend Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Frontend Sorting States
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchBases = async (options = {}) => {
    setLoading(true);
    try {
      const {
        newPage = page,
        newRowsPerPage = rowsPerPage,
        search = searchQuery,
      } = options;

      const response = await getBases({
        page: newPage + 1,
        limit: newRowsPerPage,
        search, // Pass search query to the backend
      });

      console.log("response from api", response?.data?.data?.data)
      setBases(response?.data?.data?.data || []); // Access 'data' array directly, default to empty array
      setTotal(response?.data?.data?.pagination?.totalBases || 0); // Access totalBases from pagination
      setPage(response?.data?.data?.pagination?.currentPage - 1 || 0); // Convert back to 0-indexed for frontend state

    } catch (error) {
      console.error("Error fetching bases:", error);
      setBases([]); // Ensure bases is an array on error
      setTotal(0);
      setPage(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch and refetch on pagination/search changes
    fetchBases({ newPage: page, newRowsPerPage: rowsPerPage, search: searchQuery });
  }, [page, rowsPerPage, searchQuery]);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBaseUser(form);
      handleClose();
      fetchBases(); // Refresh current page after adding
    } catch (error) {
      console.error("Failed to create base user", error);
    }
  };

  // Pagination Handlers (trigger backend fetch)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // `useEffect` will handle calling `fetchBases` because `page` state changed
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
    // `useEffect` will handle calling `fetchBases` because `rowsPerPage` state changed
  };

  // Search Handler (trigger backend fetch)
  const handleSearch = (searchVal) => {
    setSearchQuery(searchVal);
    setPage(0); // Reset to first page on new search
    // `useEffect` will handle calling `fetchBases` because `searchQuery` state changed
  };

  // Sort Handler (trigger frontend sort)
  const handleSortChange = (field) => {
    const newSortOrder = (sortField === field && sortOrder === "asc") ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    // Sorting is handled by useMemo on the existing 'bases' data, no need to call fetchBases here
  };

  // Helper function to get nested property value for sorting
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Frontend sorting logic applied to the 'bases' data
  const sortedBases = useMemo(() => {
    let currentData = Array.isArray(bases) ? [...bases] : [];

    if (sortField) {
      currentData.sort((a, b) => {
        let aValue = getNestedValue(a, sortField);
        let bValue = getNestedValue(b, sortField);

        // Handle null/undefined values for consistent sorting
        aValue = aValue === undefined || aValue === null ? "" : aValue;
        bValue = bValue === undefined || bValue === null ? "" : bValue;

        // Type-specific comparison
        if (sortField === "createdAt") { // Special handling for date fields
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          // Check for valid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return sortOrder === 'asc' ? 1 : -1;
          if (isNaN(dateB.getTime())) return sortOrder === 'asc' ? -1 : 1;
          return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue, undefined, { sensitivity: 'base' })
            : bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0; // Fallback for other types
      });
    }
    return currentData;
  }, [bases, sortField, sortOrder]); // Dependencies for re-calculation

  const columns = [
    { field: "location", headerName: "Location", sortable: true },
    { field: "firstName", headerName: "First Name", sortable: true },
    { field: "lastName", headerName: "Last Name", sortable: true },
    { field: "email", headerName: "Email", sortable: true },
    {
      field: "createdAt",
      headerName: "Registered", // Changed headerName to Registered as per NPOs page for consistency
      render: (value) => {
        const date = value ? new Date(value) : null;
        return date && !isNaN(date) ? format(date, "dd/MM/yyyy") : "N/A";
      },
      sortable: true
    },
  ];

  const actions = [
    // {
    //   label: "Edit",
    //   icon: <EditIcon fontSize="small" />,
    //   onClick: (row) => console.log("Edit clicked:", row),
    // },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => console.log("Delete clicked:", row),
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Base Management</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add New Base
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <GenericTable
          columns={columns}
          data={sortedBases} // Pass the sorted data
          actions={actions}
          isLoading={loading}
          page={page} // Pass backend page
          rowsPerPage={rowsPerPage} // Pass backend rows per page
          total={total} // Pass backend total count
          onPageChange={handleChangePage} // Pass backend pagination handler
          onRowsPerPageChange={handleChangeRowsPerPage} // Pass backend rows per page handler
          onSearch={handleSearch} // Pass backend search handler
          onSortChange={handleSortChange} // Pass frontend sort handler
          sortField={sortField} // Pass current sort field
          sortOrder={sortOrder} // Pass current sort order
        />
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography variant="h6">Create New Base User</Typography>
          <TextField
            name="firstName"
            label="First Name"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="lastName"
            label="Last Name"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="location"
            label="Base Location (e.g., 'Lucknow, India')"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Create Base
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default BasePage;