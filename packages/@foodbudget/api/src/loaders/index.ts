import { LoaderParams } from './loaders.type';
import expressLoader from './express';
import authLoader from './auth';
import errorLoader from './errors';

const init = (loader: LoaderParams): void => {
  expressLoader(loader);
  authLoader(loader);
  errorLoader(loader);
};

export default init;
