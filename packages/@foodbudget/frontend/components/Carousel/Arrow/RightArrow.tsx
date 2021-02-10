import Arrow from './Arrow';

const RightArrow: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => (
  <Arrow {...props} style={{ right: 0 }}>
    {'>'}
  </Arrow>
);

export default RightArrow;
