import React, { useState } from 'react';
import classnames from 'classnames';

import styles from './Dropdown.module.scss';

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

const Dropdown: React.FC<DropdownProps> = ({
  values,
  placeholder,
  clearValueOnSelect,
  defaultValue,
  className,
  style,
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
    <select
      className={classnames(styles.select, className)}
      style={style}
      required
      onChange={handleOnChange}
      defaultValue={placeholder || defaultValue || values[0]}
      value={selectedValue}
      {...props}
    >
      {placeholder && (
        <option
          className={classnames(styles.option)}
          disabled
          aria-disabled
          hidden
        >
          {placeholder}
        </option>
      )}
      {values.map((value, index) => (
        <option key={`option-${index}`}>{value}</option>
      ))}
    </select>
  );
};

export default Dropdown;
