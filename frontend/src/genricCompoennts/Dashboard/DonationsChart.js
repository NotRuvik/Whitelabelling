import React from 'react';
import { Box, Card, Typography, Paper } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

// Custom Tooltip Component for rich hover information
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper sx={{ p: 1.5, background: 'rgba(255, 255, 255, 0.95)', borderRadius: 2, boxShadow: 3, border: '1px solid #ddd' }}>
        <Typography variant="body2" fontWeight="bold">
          {format(new Date(data.date), 'MMM d, yyyy')}
        </Typography>
        <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
          Amount: <strong>${data.amount.toFixed(2)}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          To: {data.targetName || 'N/A'}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const DonationsChart = ({ chartData, title }) => {
  // We need to aggregate the data by date for the chart to display correctly,
  // while still having the individual donations for the tooltip.
  // Recharts can handle multiple data points on the same X-axis value.
  const formattedData = chartData.map(item => ({
    ...item,
    // Format date for X-axis label (e.g., "Jul 21")
    formattedDate: format(new Date(item.date), 'MMM d'),
  }));

  return (
    <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="formattedDate"
              stroke="#9e9e9e"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#9e9e9e"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#2e7d32"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
              dot={{ r: 4, stroke: '#2e7d32', fill: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#2e7d32', fill: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default DonationsChart;
