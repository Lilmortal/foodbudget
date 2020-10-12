import { LoaderParams } from './loaders.type';
import expressLoader from './express';
import authLoader from './auth';

const init = (loader: LoaderParams): void => {
  authLoader(loader);
  expressLoader(loader);
};

export default init;
