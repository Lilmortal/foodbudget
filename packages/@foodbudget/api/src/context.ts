import serviceManager, { ServiceManager } from './serviceManager';

export interface Context {
    serviceManager: ServiceManager
}

const context = (): Context => ({ serviceManager });

export default context;
