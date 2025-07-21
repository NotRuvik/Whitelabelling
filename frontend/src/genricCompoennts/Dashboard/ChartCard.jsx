import React from "react";
import { Box, Card, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const ChartCard = ({ title, value, change, isIncrease, chartData }) => (
  <Card
    variant="outlined"
    sx={{
      p: 2.5,
      borderRadius: 3,
      backgroundColor: "#fff",
      boxShadow: "none",
      width: 570, // Equal to 2x StatCard width (250px + margin)
    }}
  >
    {/* Top Section: Title, Value, Date Range */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      {/* Title and Stats */}
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

      {/* Date Range Chip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: "6px 12px",
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          gap: 1,
        }}
      >
        <CalendarMonthIcon fontSize="small" />
        <Typography variant="body2" noWrap>
          Nov 30 – Dec 30, 2023
        </Typography>
      </Box>
    </Box>

    {/* Chart Section */}
    <Box sx={{ height: 150 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="#9e9e9e"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#9e9e9e"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#2e7d32"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#chartGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  </Card>
);

export default ChartCard;
