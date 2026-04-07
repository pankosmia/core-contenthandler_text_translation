import { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";

export function SelectOption({ title, type, option, handleChange }) {
  const [selectedValue, setSelectedValue] = useState(
    option[0] || ""
  );

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    handleChange(type, value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        px: 2.75,
        mb: 1.5,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Lato",
          fontWeight: 400,
          color: "black",
          pr: 4,
          fontSize: 22,
        }}
      >
        {title}
      </Typography>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id={`${type}-label`}>Please Choose...</InputLabel>

        <Select
          labelId={`${type}-label`}
          value={selectedValue}
          label="Please Choose..."
          onChange={handleSelectChange}
          sx={{ borderRadius: 1 }}
        >
          {option.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}