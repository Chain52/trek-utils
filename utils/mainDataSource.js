import { mongo } from '../database';
import queryExecutor from './queryExecutor';
import _ from 'lodash';

export default ({ database = mongo }) => {
  const _database = database;

  return {
    get database() {
      return _database;
    },

    get databaseConnection() {
      return _database.connect();
    },

    get databaseModels() {
      return _database.models;
    },

    get modelRegistry() {
      return _database.modelRegistry;
    },

    queryExecutor(modelName) {
      return queryExecutor(_.get(this.databaseModels(), modelName));
    },
  };
};
