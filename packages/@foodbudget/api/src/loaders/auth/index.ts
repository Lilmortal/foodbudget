import { LoaderParams } from '../loaders.type';
import authLoader from './authLoader';
import authRoutes from './authRoutes';

const authLoaderComposite = (loaderParams: LoaderParams): void => {
  authLoader(loaderParams);
  authRoutes(loaderParams);
};

export default authLoaderComposite;
