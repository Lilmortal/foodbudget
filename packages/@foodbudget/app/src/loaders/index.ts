import { LoaderParams } from './loaders.type';
import expressLoader from './express';

const init = async ({ app, config }: LoaderParams): Promise<void> => {
  expressLoader({ app, config });
};

export default init;
