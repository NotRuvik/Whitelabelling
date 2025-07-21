import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Chip,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddCauseForm from "./AddCauseForm";
import ListOfCauses from './ListCauses';

const CausesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
const [causeToEdit, setCauseToEdit] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
 const handleEditCause = (cause) => {
    setCauseToEdit(cause);
    setActiveTab(1); // switch to Add/Edit tab
  };
   const handleFormSuccess = () => {
    setActiveTab(0);
    setCauseToEdit(null);
  };
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, bgcolor: "transparent" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              display: "none",
              //backgroundColor: '#be965a',
            },
          }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              color: "#be965a",
              borderRadius: "20px 20px 20px 20px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#be965a",
                color: "#fff",
              },
            },
            marginBottom: "10px",
            "& .Mui-selected": {
              color: "be965a",
              // backgroundColor: "#be965a",
              fontWeight: 600,
            },
          }}
        >
          <Tab label="List of Causes" sx={{ mr: 2 }} />
          <Tab label="Add New Cause" />
        </Tabs>
      </Box>

      {/* Content for the selected tab */}
      {activeTab === 0 && <ListOfCauses  onEdit={handleEditCause} />}
      {activeTab === 1 && <AddCauseForm initialData={causeToEdit}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setActiveTab(0);
            setCauseToEdit(null);
          }} />}
    </Paper>
  );
};

export default CausesPage;
