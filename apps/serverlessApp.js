import middlewares from '../middlewares';
import { connection, logger } from '../utils';

const LAMBDA_API_VERSION = 'v1.0';
const TREK_API_VERSION = 'v1.0';
const DEFAULT_CONFIG = {
  database: {
    connect: false,
  },
  registries: {
    controller: null,
  },
};

const serverlessApp = ({ config = DEFAULT_CONFIG }) => {
  _config = config;

  return {
    async init() {
      const app = require('lambda-api')({
        version: LAMBDA_API_VERSION,
        base: TREK_API_VERSION,
        logger: logger().config,
      });
      middlewares(app);
      if (_config.database.connect) {
        connection().open();
      }
      if (_config.registries.controller) {
        _config.registries.controller(app).register();
      }
      return app;
    },
  };
};

export default async config => {
  return await serverlessApp(config).init();
};
