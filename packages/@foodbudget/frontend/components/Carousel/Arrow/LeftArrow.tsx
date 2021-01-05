import { Arrow } from './Arrow';

const LeftArrow: React.FC<{}> = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => <Arrow {...props}>{'<'}</Arrow>;

export default LeftArrow;
