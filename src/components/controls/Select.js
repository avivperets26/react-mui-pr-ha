import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@material-ui/core";

export default function Select(props) {
  const { name, label, value, error = null, onChange, options } = props;

  return (
    <FormControl
      variant="outlined"
      style={{ minWidth: 140 }}
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
