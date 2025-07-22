import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import api from "../services/api";
import GenericTable from "../genricCompoennts/GenericTable"; 
import { StatusPill } from "../genricCompoennts/CustomTableParts";
import { fetchOrganizations } from '../services/organizationService';
import { getMissionaries } from '../services/missionary.service';

const PaymentsPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [npoList, setNpoList] = useState([]);
  const [selectedNpo, setSelectedNpo] = useState(null);
  const [missionaries, setMissionaries] = useState([]);
  const [selectedMissionary, setSelectedMissionary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    sortBy: "date",
    sortOrder: "desc",
    missionaryId: "",
    npoId: "",
  });
  const [userRole, setUserRole] = useState(null);

  // Get user role from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role || null);
  }, []);

  // Fetch NPOs for super_admin
  useEffect(() => {
    if (userRole === 'super_admin') {
      fetchOrganizations(1, 1000).then(res => {
        const npos = res.data.data.data || [];
        setNpoList(npos);
      }).catch(() => setNpoList([]));
    }
  }, [userRole]);

  // Fetch missionaries for filter dropdown
  useEffect(() => {
    if (userRole === 'super_admin') {
      if (selectedNpo) {
        // Fetch missionaries for selected NPO
        getMissionaries({ organizationId: selectedNpo._id }).then(res => {
          setMissionaries(res.data.data || []);
        }).catch(() => setMissionaries([]));
      } else {
        // Fetch all missionaries
        api.get('/missionaries/list').then(res => {
          setMissionaries(res.data.data || []);
        }).catch(() => setMissionaries([]));
      }
    } else {
      // For NPO admin, fetch missionaries for their org
      api.get('/missionaries/list').then(res => {
        setMissionaries(res.data.data || []);
      }).catch(() => setMissionaries([]));
    }
  }, [userRole, selectedNpo]);

  // Delayed search term update
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter update on missionary select
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      missionaryId: selectedMissionary ? selectedMissionary._id : "",
      page: 1,
    }));
  }, [selectedMissionary]);

  // Filter update on NPO select (super_admin only)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      npoId: selectedNpo ? selectedNpo._id : "",
      page: 1,
      missionaryId: "", // Reset missionary filter when NPO changes
    }));
    setSelectedMissionary(null);
  }, [selectedNpo]);

  // Fetch paginated & filtered payment data
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await api.get("/payments/admin-view", {
          params: filters,
        });
        const { data: rows, pagination } = response.data.data;
        setData(rows);
        setPagination(pagination);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [filters]);

  // Handlers
  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleSort = (field) => {
    const isAsc = filters.sortBy === field && filters.sortOrder === "asc";
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: isAsc ? "desc" : "asc",
    }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { field: "missionaryName", headerName: "Missionary", sortable: false },
    { field: "targetName", headerName: "Target", sortable: false },
    { field: "donorName", headerName: "Donor", sortable: true },
    {
      field: "amount",
      headerName: "Amount",
      sortable: true,
      render: (amount) => `$${(amount || 0).toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      render: (status) => (
        <StatusPill active={status === "succeeded"}>{status}</StatusPill>
      ),
    },
  ];

  const actions = [
    {
      label: "View Receipt",
      icon: <ReceiptLongIcon />,
      onClick: (row) => console.log("View details for:", row._id),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Ministry Payments
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        A history of all donations. Use the filters to search by donor, NPO, or missionary.
      </Typography>

      {/* Table */}
      <GenericTable
        columns={columns}
        data={data}
        isLoading={loading}
        page={pagination.currentPage - 1}
        rowsPerPage={10}
        total={pagination.totalCount}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        sortField={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSortChange={handleSort}
        actions={actions}
        showSearchBar={false}
        customFilters={
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "100%" }}>
            <TextField
              variant="outlined"
              placeholder="Search by Donor Name..."
              size="small"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: "8px" },
              }}
              sx={{ flex: "1 1 300px" }}
            />
            {userRole === 'super_admin' && (
              <Autocomplete
                options={npoList}
                getOptionLabel={(option) => option.name}
                value={selectedNpo}
                onChange={(event, newValue) => setSelectedNpo(newValue)}
                isOptionEqualToValue={(option, value) => option._id === value?._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by NPO"
                    size="small"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      sx: { borderRadius: "8px" },
                    }}
                  />
                )}
                sx={{ flex: "1 1 300px" }}
              />
            )}
            <Autocomplete
              options={missionaries}
              getOptionLabel={(option) => option.name}
              value={selectedMissionary}
              onChange={(event, newValue) => setSelectedMissionary(newValue)}
              isOptionEqualToValue={(option, value) => option._id === value?._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Missionary"
                  size="small"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: "8px" },
                  }}
                />
              )}
              sx={{ flex: "1 1 300px" }}
            />
          </Box>
        }
      />
    </Box>
  );
};

export default PaymentsPage;
