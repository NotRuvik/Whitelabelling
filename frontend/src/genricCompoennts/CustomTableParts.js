import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

/**
 * A styled component for displaying a status (e.g., Active/Inactive).
 * It changes color based on the 'active' prop.
 */
export const StatusPill = styled("div")(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: "16px",
  fontWeight: 600,
  fontSize: "0.8rem",
  color: active ? "#005249" : "#521200",
  backgroundColor: active ? "#c8facd" : "#ffdeda",
  "& .status-dot": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    marginRight: theme.spacing(1),
    backgroundColor: active ? "#00ab55" : "#ff4842",
  },
}));

/**
 * A custom pagination control component with more detailed navigation.
 */
export const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleFirstPage = (e) => onPageChange(e, 0);
  const handlePrevPage = (e) => onPageChange(e, page - 1);
  const handleNextPage = (e) => onPageChange(e, page + 1);
  const handleLastPage = (e) => onPageChange(e, totalPages - 1);

  const pageNumbers = Array.from({ length: 5 }, (_, i) => {
    const pageIndex = i + Math.max(0, page - 2);
    return pageIndex < totalPages ? pageIndex + 1 : null;
  }).filter(Boolean);

  const isFirstDisabled = page === 0;
  const isLastDisabled = page === totalPages - 1;

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
      {/* Left Pagination Controls */}
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

        <Typography
          variant="body2"
          sx={{ fontWeight: 500, fontSize: "14px", color: "#333", px: 1 }}
        >
          {page + 1} / {totalPages}
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

        {/* Page Number Pills */}
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

      {/* Right-aligned Total Pages */}
      <Typography variant="body2" sx={{ ml: "auto", color: "text.secondary" }}>
        Total pages: {totalPages}
      </Typography>
    </Box>
  );
};
