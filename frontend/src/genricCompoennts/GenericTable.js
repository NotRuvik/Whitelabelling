import { StatusPill } from "./CustomTableParts";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

const TablePaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(2),
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  backgroundColor: "#ffffff",
}));
const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "1px solid #f1f3f4",
  color: theme.palette.text.secondary,
  fontWeight: 600,
  padding: "16px",
  backgroundColor: "#f4f6f8",
}));

const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleFirstPage = (e) => onPageChange(e, 0);
  const handlePrevPage = (e) => onPageChange(e, page - 1);
  const handleNextPage = (e) => onPageChange(e, page + 1);
  const handleLastPage = (e) => onPageChange(e, totalPages - 1);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(0, page - 2);
    const endPage = Math.min(totalPages - 1, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i + 1);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const isFirstDisabled = page === 0;
  const isLastDisabled = page >= totalPages - 1 || totalPages === 0;

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Left Pagination Buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={handleFirstPage}
          disabled={isFirstDisabled}
          sx={{ bgcolor: "#f4f6f8", borderRadius: 2 }}
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handlePrevPage}
          disabled={isFirstDisabled}
          sx={{ bgcolor: "#f4f6f8", borderRadius: 2 }}
        >
          <KeyboardArrowLeft fontSize="small" />
        </IconButton>

        {/* Current Page / Total */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#333",
            px: 1,
          }}
        >
          {page + 1} / {totalPages === 0 ? 1 : totalPages}
        </Typography>

        <IconButton
          onClick={handleNextPage}
          disabled={isLastDisabled}
          sx={{ bgcolor: "#f4f6f8", borderRadius: 2 }}
        >
          <KeyboardArrowRight fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleLastPage}
          disabled={isLastDisabled}
          sx={{ bgcolor: "#f4f6f8", borderRadius: 2 }}
        >
          <LastPageIcon fontSize="small" />
        </IconButton>

        {/* Page Numbers */}
        {pageNumbers.map((num) => (
          <Button
            key={num}
            onClick={(e) => onPageChange(e, num - 1)}
            variant="contained"
            disableElevation
            sx={{
              minWidth: 36,
              height: 36,
              fontSize: "14px",
              p: 0,
              borderRadius: 2,
              backgroundColor: page + 1 === num ? "primary.main" : "#f4f6f8",
              color: page + 1 === num ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: page + 1 === num ? "primary.light" : "#e0e0e0",
              },
            }}
          >
            {num}
          </Button>
        ))}
      </Box>

      {/* Right Total Pages */}
      <Typography variant="body2" sx={{ ml: "auto", color: "text.secondary" }}>
        Total pages: {totalPages === 0 ? 1 : totalPages}
      </Typography>
    </Box>
  );
};

const GenericTable = ({
  columns,
  data = [],
  actions,
  isLoading,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onSearch,
  sortField,
  sortOrder,
  onSortChange,
  showSearchBar = true, 
  customFilters = null,
}) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (onSearch) onSearch(search);
  };

  // Memoize sorted data to prevent unnecessary re-renders
  // This now only sorts the 'data' prop (which is already paginated and searched by parent)
  const sortedData = useMemo(() => {
    let currentData = Array.isArray(data) ? [...data] : [];

    if (sortField) {
      currentData.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        // Handle string comparison (case-insensitive)
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue, undefined, { sensitivity: "base" })
            : bValue.localeCompare(aValue, undefined, { sensitivity: "base" });
        }
        // Handle number comparison
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
        // Handle Date comparison (if applicable, convert to timestamp)
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        // Fallback for other types or mixed types
        return 0;
      });
    }

    return currentData;
  }, [data, sortField, sortOrder, columns]); // Dependencies include data prop, and external sort props

  return (
    <TablePaper>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {customFilters}
        {showSearchBar && (
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: "flex", gap: 8 }}
          >
            <TextField
              variant="outlined"
              placeholder="Search here"
              size="small"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: "8px", backgroundColor: "#ffffff" },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                "&:hover": { backgroundColor: "primary.light" },
              }}
            >
              Search
            </Button>
          </form>
        )}
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <HeaderTableCell
                  key={col.field}
                  onClick={() => col.sortable && onSortChange(col.field)}
                  sx={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {col.headerName}
                    {col.sortable && (
                      <ArrowUpwardIcon
                        sx={{
                          ml: 0.5,
                          transform:
                            sortField === col.field && sortOrder === "asc"
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                          transition: "transform 0.2s ease-in-out",
                          opacity: sortField === col.field ? 1 : 0.4,
                        }}
                      />
                    )}
                  </Box>
                </HeaderTableCell>
              ))}
              {actions && (
                <HeaderTableCell sx={{ textAlign: "center" }}>
                  Actions
                </HeaderTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  align="center"
                >
                  <Box sx={{ p: 5 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  align="center"
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ p: 3 }}
                  >
                    No data found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, idx) => (
                <TableRow
                  key={row._id || idx}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.field} sx={{ py: 2 }}>
                      {col.field === "status" ? (
                        <StatusPill
                          active={
                            row.isActive ||
                            (row.status &&
                              row.status.toLowerCase() === "active")
                          }
                        >
                          <div className="status-dot" />
                          {row[col.field]}
                        </StatusPill>
                      ) : col.render ? (
                        col.render(row[col.field], row)
                      ) : (
                        row[col.field]
                      )}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="center">
                      {actions
                        .filter(
                          (action) =>
                            !action.shouldRender || action.shouldRender(row)
                        )
                        .map((action, index) => (
                          <Tooltip title={action.label} key={index}>
                            <IconButton
                              onClick={() => action.onClick(row)}
                              size="small"
                              sx={{
                                mx: 0.5,
                                bgcolor: "#f4f6f8",
                                "&:hover": { bgcolor: "primary.light" },
                              }}
                            >
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
      <CustomPagination
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
      />
      {/* Removed the Rows per page selector as requested */}
    </TablePaper>
  );
};

export default GenericTable;
