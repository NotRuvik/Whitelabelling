import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    CircularProgress,
    Tooltip,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import api from '../services/api'; // Your configured axios instance
import { CustomPagination, StatusPill } from '../genricCompoennts/CustomTableParts';
import { toast } from 'react-hot-toast'; 
// Main Page Component for a Logged-in Donor
const DonationPage = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        page: 1,
        sortBy: 'date',
        sortOrder: 'desc',
    });

    // Debounce search input to avoid excessive API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch data when filters (search, sort, page) change
    useEffect(() => {
        const fetchMyDonations = async () => {
            setLoading(true);
            try {
                const response = await api.get('/donations/my-history', { params: filters });
                setData(response.data.data.data);
                setPagination(response.data.data.pagination);
            } catch (error) {
                console.error("Failed to fetch donation history:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMyDonations();
    }, [filters]);

    // Handlers for pagination and sorting
    const handlePageChange = (event, newPage) => {
        setFilters(prev => ({ ...prev, page: newPage + 1 }));
    };

    const handleSort = (field) => {
        const isAsc = filters.sortBy === field && filters.sortOrder === 'asc';
        setFilters(prev => ({
            ...prev,
            sortBy: field,
            sortOrder: isAsc ? 'desc' : 'asc',
        }));
    };

    // Define the columns for the GenericTable
    const columns = [
        { field: 'date', headerName: 'Date', sortable: true, render: (date) => new Date(date).toLocaleDateString() },
        { field: 'target', headerName: 'Donation To', sortable: true },
        { field: 'amount', headerName: 'Amount', sortable: true, render: (amount) => `$${amount.toFixed(2)}` },
        { field: 'donationType', headerName: 'Type', sortable: false, render: (type) => type.charAt(0).toUpperCase() + type.slice(1) },
        { field: 'status', headerName: 'Status', sortable: false, render: (status) => <StatusPill active={status === 'succeeded'}>{status}</StatusPill> },
    ];
    
    // ✅ FIX: Implement the View Receipt functionality
  const actions = [
    {
        label: 'View Receipt',
        icon: <ReceiptLongIcon />,
        onClick: async (row) => {
            if (!row.stripePaymentIntentId) {
                toast.error("Receipt is not available for this transaction.");
                return;
            }

            try {
                const response = await api.get(`/donations/receipt/${row.stripePaymentIntentId}`);
                
                // Handle different response formats
                let receiptUrl;
                if (response.data?.data?.url) {
                    receiptUrl = response.data.data.url;
                } else if (response.data?.url) {
                    receiptUrl = response.data.url;
                }

                if (receiptUrl) {
                    const newWindow = window.open(receiptUrl, '_blank', 'noopener,noreferrer');
                    
                    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        toast.error("Receipt window blocked. Please disable your pop-up blocker for this site.");
                    }
                } else {
                    // Fallback to Stripe dashboard if no direct URL
                    const stripeUrl = `https://dashboard.stripe.com/${
                        process.env.NODE_ENV === 'production' ? '' : 'test/'
                    }payments/${row.stripePaymentIntentId}`;
                    window.open(stripeUrl, '_blank', 'noopener,noreferrer');
                }
            } catch (error) {
                console.error("Failed to fetch receipt:", error);
                toast.error(error.response?.data?.message || "Could not open receipt. Please try again later.");
            }
        },
    }
];

    return (
        <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.05)' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">My Donation History</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                A record of all your generous contributions.
            </Typography>

            {/* Use your existing GenericTable component */}
            <GenericTable
                columns={columns}
                data={data}
                pagination={pagination}
                loading={loading}
                filters={filters}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onPageChange={handlePageChange}
                onSort={handleSort}
                actions={actions}
            />
        </Paper>
    );
};

// This is your GenericTable component, used as-is.
// No modifications are needed here.
const GenericTable = ({ columns, data, pagination, loading, filters, onSearchChange, onPageChange, onSort, actions }) => {
    return (
        <Box>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    variant="outlined"
                    placeholder="Search by cause or missionary name..."
                    size="small"
                    fullWidth
                    onChange={onSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: '8px' }
                    }}
                />
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.field} onClick={() => col.sortable && onSort(col.field)}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: col.sortable ? 'pointer' : 'default' }}>
                                        {col.headerName}
                                        {col.sortable && (
                                            <IconButton size="small" sx={{ ml: 0.5 }}>
                                                {filters.sortBy === col.field ? (
                                                    filters.sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />
                                                ) : <ArrowUpwardIcon fontSize="inherit" sx={{ color: 'text.disabled' }} />}
                                            </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                            ))}
                            {actions && <TableCell align="center">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" sx={{ p: 5 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" sx={{ p: 5 }}>
                                    <Typography>No donations found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow key={row._id} hover>
                                    {columns.map((col) => (
                                        <TableCell key={col.field}>
                                            {col.render ? col.render(row[col.field], row) : row[col.field]}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell align="center">
                                            {actions.map((action, idx) => (
                                                <Tooltip title={action.label} key={idx}>
                                                    <IconButton size="small" onClick={() => action.onClick(row)}>
                                                        {action.icon}
                                                    </IconButton>
                                                </Tooltip>
                                            ))}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {!loading && pagination.totalCount > 0 && (
                 <CustomPagination
                    count={pagination.totalCount}
                    rowsPerPage={10}
                    page={pagination.currentPage - 1}
                    onPageChange={onPageChange}
                />
            )}
        </Box>
    );
};

export default DonationPage;
