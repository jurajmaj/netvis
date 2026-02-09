import React from "react";

function SelectBox({ options, value, onChange, className }) {
  return (
    <select value={value} onChange={onChange} className={className}>
      {options
        .filter((option) => option.data.label)
        .map((option) => (
          <option key={option.id} value={option.data.label}>
            {option.data.label}
          </option>
        ))}
    </select>
  );
}

export default SelectBox;
