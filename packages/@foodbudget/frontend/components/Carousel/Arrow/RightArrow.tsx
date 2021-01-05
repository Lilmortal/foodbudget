import { Arrow } from './Arrow';

const RightArrow: React.FC<{}> = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => (
  <Arrow {...props} style={{ right: 0 }}>
    {'>'}
  </Arrow>
);

export default RightArrow;
