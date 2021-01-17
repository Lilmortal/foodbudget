import React, { useState } from 'react';
import styled from 'styled-components';

export interface DropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  /**
   * overwrite placeholder as the selected value.
   */
  defaultValue?: string;
  clearValueOnSelect?: boolean;
  values: string[];
  onChange(element: React.SyntheticEvent<HTMLSelectElement, Event>): void;
}

const Option = styled.option((props) => ({
  borderColor: props.theme.colors.primaryBorder,
}));

const Select = styled.select((props) => ({
  border: `1px solid ${props.theme.colors.primaryBorder}`,
  borderRadius: '19px',
  padding: '1.5rem',
  boxShadow: '0 1px 0 1px rgba(0,0,0,.04)',
  maxWidth: '400px',
  width: '100%',
  position: 'relative',
  appearance: 'none',
  background: `url('down-arrow.svg') ${props.theme.colors.white}`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '16px 17px',
  backgroundPosition: '96% 9px',
}));

const Dropdown: React.FC<DropdownProps> = ({
  values,
  placeholder,
  clearValueOnSelect,
  defaultValue,
  onChange,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState<string>();

  const handleOnChange = (
    element: React.SyntheticEvent<HTMLSelectElement, Event>,
  ) => {
    if (clearValueOnSelect) {
      setSelectedValue(placeholder);
    } else {
      setSelectedValue(element.currentTarget.value);
    }
    onChange(element);
  };

  return (
    <Select
      required
      onChange={handleOnChange}
      defaultValue={placeholder || defaultValue || values[0]}
      value={selectedValue}
      {...props}
    >
      {placeholder && (
        <Option disabled aria-disabled hidden>
          {placeholder}
        </Option>
      )}
      {values.map((value, index) => (
        <Option key={`option-${index}`}>{value}</Option>
      ))}
    </Select>
  );
};

export default Dropdown;
