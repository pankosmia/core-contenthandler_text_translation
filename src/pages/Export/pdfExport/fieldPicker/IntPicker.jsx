import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

export function IntPicker({
  doReset,
  fieldInfo,
  setJsonSpec,
  lang,
  open = true,
}) {
  const [value, setValue] = useState(fieldInfo.suggestedDefault || '');

  // Update JSON spec whenever value changes
  useEffect(() => {
    setJsonSpec((prev) => {
      const newState = typeof prev === 'object' ? prev : JSON.parse(prev);
      if (fieldInfo.minValue != null) {
        newState[fieldInfo.id] = parseInt(value, 10);
      } else {
        newState[fieldInfo.id] = value;
      }
      return JSON.stringify(newState);
    });
  }, [value]);

  const handleChange = (event) => {
    let newValue = event.target.value;
    // Enforce min/max if provided
    if (fieldInfo.minValue != null) {
      const intVal = parseInt(newValue, 10);
      if (!isNaN(intVal)) {
        if (intVal < fieldInfo.minValue) newValue = fieldInfo.minValue;
        if (intVal > fieldInfo.maxValue) newValue = fieldInfo.maxValue;
      } else {
        newValue = '';
      }
    }
    setValue(newValue);
  };

  const handleBlur = (event) => {
    const newValue = event.target.value.trim();
    setValue(newValue);
  };

  const resetField = () => {
    setValue(fieldInfo.suggestedDefault || '');
  };

  useEffect(() => {
    resetField();
  }, [doReset]);

  return (
    <div style={open ? {} : { display: 'none' }}>
      <TextField
        label={`${fieldInfo.label[lang]}${
          fieldInfo.minValue != null
            ? ` ${fieldInfo.minValue}-${fieldInfo.maxValue}`
            : ''
        }`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        type="number"
        variant="standard"
        inputProps={{
          min: fieldInfo.minValue,
          max: fieldInfo.maxValue,
          step: 1,
        }}
      />
    </div>
  );
}