import { LoaderParams } from './loaders.type';
import expressLoader from './express';

const init = ({ app }: LoaderParams): void => {
  expressLoader({ app });
};

export default init;
