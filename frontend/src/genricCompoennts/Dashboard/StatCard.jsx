import React from "react";
import { Box, Card, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StatCard = ({ title, value, change, isIncrease }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor: "#fff",
        boxShadow: "none",
        width: "370px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>

            <Box
              sx={{
                backgroundColor: isIncrease ? "#d1fae5" : "#fee2e2",
                color: isIncrease ? "#059669" : "#dc2626",
                borderRadius: 999,
                px: 1,
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {isIncrease ? `↑${change}` : `↓${change}`}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#d1fae5",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowForwardIcon fontSize="small" sx={{ color: "#059669" }} />
        </Box>
      </Box>
    </Card>
  );
};

export default StatCard;
