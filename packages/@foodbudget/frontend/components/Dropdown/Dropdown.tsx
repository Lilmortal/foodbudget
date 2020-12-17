import styled from 'styled-components';

export interface DropdownProps {
  placeholder?: string;
  values: string[];
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

const Dropdown: React.FC<DropdownProps> = ({ values, placeholder }) => (
  <Select required>
    {placeholder && (
      <Option value="" disabled aria-disabled selected hidden>
        Ingredients...
      </Option>
    )}
    {values.map((value) => (
      <Option>{value}</Option>
    ))}
  </Select>
);

export default Dropdown;
