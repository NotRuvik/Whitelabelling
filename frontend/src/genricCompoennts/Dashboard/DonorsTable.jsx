import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    Chip
} from '@mui/material';
import { format } from 'date-fns';

const DonorsTable = ({ donors, pagination, onPageChange, onRowsPerPageChange }) => {
    
    const { data = [], pagination: { currentPage = 1, totalPages = 1, totalDonors = 0 } = {} } = { data: donors, pagination };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="donors table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Donor Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Last Donation</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Contribution</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}># of Donations</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? data.map((donor) => (
                            <TableRow hover key={donor.donorId}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="subtitle2">{donor.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{donor.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(donor.lastDonationDate), 'PP')}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body1" fontWeight="500">
                                        ${donor.totalContribution.toFixed(2)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={donor.numDonations} size="small" />
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography sx={{ p: 3 }}>No donor data available.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalDonors}
                rowsPerPage={pagination.limit || 10}
                page={currentPage - 1}
                onPageChange={(event, newPage) => onPageChange(newPage + 1)}
                onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
            />
        </Paper>
    );
};

export default DonorsTable;
