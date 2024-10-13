import React from "react";

export interface DropdownMenuOption {
  value: string;
  label: string;
}

export interface DropdownMenuProps {
  options: DropdownMenuOption[];
  selected: string;
  setSelected: Function;
}

const DropdownMenu = (props: DropdownMenuProps) => {
  const handleChange = (event) => {
    props.setSelected(event.target.value);
    console.log("Selected:", event.target.value);
  };

  return (
    <div className="pt-3">
      <select
        className="cursor-pointer outline-none"
        value={props.selected}
        onChange={handleChange}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
