import { LoaderParams } from './loaders.type';
import expressLoader from './express';

const init = async ({ app, config, serviceManager }: LoaderParams): Promise<void> => {
  expressLoader({ app, config, serviceManager });
};

export default init;
