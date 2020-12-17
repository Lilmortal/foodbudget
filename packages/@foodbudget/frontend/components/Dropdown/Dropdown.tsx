import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

export interface DropdownProps {
  placeholder?: string;
  /**
   * overwrite placeholder as the selected value.
   */
  defaultValue?: string;
  clearValueOnSelect?: boolean;
  values: string[];
  onSelect(element: React.SyntheticEvent<HTMLSelectElement, Event>): void;
}

const Option = styled.option((props) => ({
  borderColor: props.theme.colors.primaryBorder,
}));

const Select = styled.select((props) => ({
  border: `1px solid ${props.theme.colors.primaryBorder}`,
  borderRadius: '19px',
  padding: '1rem 2.5rem',
  boxShadow: '0 1px 0 1px rgba(0,0,0,.04)',
  maxWidth: '400px',
  width: '100%',
}));

const Dropdown: React.FC<DropdownProps> = ({
  values,
  placeholder,
  clearValueOnSelect,
  defaultValue,
  onSelect,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>();

  const onChange = (
    element: React.SyntheticEvent<HTMLSelectElement, Event>,
  ) => {
    if (clearValueOnSelect) {
      setSelectedValue(placeholder);
    } else {
      setSelectedValue(element.currentTarget.value);
    }
    onSelect(element);
  };

  return (
    <Select
      required
      onChange={onChange}
      defaultValue={placeholder || defaultValue || values[0]}
      value={selectedValue}
    >
      {placeholder && (
        <Option disabled aria-disabled hidden>
          {placeholder}
        </Option>
      )}
      {values.map((value) => (
        <Option key={`option-${v4()}`}>{value}</Option>
      ))}
    </Select>
  );
};

export default Dropdown;
