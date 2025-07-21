import React from "react";
import Radio from "@mui/material/Radio";
import CheckIcon from "@mui/icons-material/Check";
import { Box } from "@mui/material";

const CustomRadio = (props) => {
  return (
    <Radio
      {...props}
      icon={
        <Box
          sx={{
            width: 24,
            height: 24,
            bgcolor: "#f86c6b", // red filled
            borderRadius: "50%",
          }}
        />
      }
      checkedIcon={
        <Box
          sx={{
            width: 24,
            height: 24,
            border: "2px solid #B68B4C",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
          }}
        >
          <CheckIcon sx={{ fontSize: 16 }} />
        </Box>
      }
    />
  );
};

export default CustomRadio;
