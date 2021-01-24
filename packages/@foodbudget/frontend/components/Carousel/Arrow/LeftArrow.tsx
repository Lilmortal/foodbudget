import Arrow from './Arrow';

const LeftArrow: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => <Arrow {...props}>{'<'}</Arrow>;

export default LeftArrow;
