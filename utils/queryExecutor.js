import _ from 'lodash';
import queryHelper from './queryHelper';

const DEFAULT_UPDATE_OPTIONS = {
  upsert: false,
  new: true,
};

const DEFAULT_REMOVE_OPTIONS = {};

const DEFAULT_UPSERT_OPTIONS = {
  upsert: true,
  new: true,
  runValidators: true,
  setDefaultsOnInsert: true,
};

export default ({ model, helper = queryHelper() }) => {
  const _model = model;
  const _helper = helper;

  const applySanitization = (docs, applyFunction) => {
    let paths = [];
    if (_.isArray(populateInputOptions)) {
      populateInputOptions.forEach(option => {
        paths.push(option.path);
      });
    } else if (_.isObject(populateInputOptions)) {
      paths.push(populateInputOptions.path);
    } else {
      paths.push(populateInputOptions);
    }
    applyFunction(docs, paths);
  };

  return {
    get model() {
      return _model;
    },

    get helper() {
      return _helper;
    },

    sanitize(args) {
      let docs = args.results;
      let populateInputOptions = args.options.populate;
      if (
        !args.options.lean ||
        _.isEmpty(populateInputOptions) ||
        _.isEmpty(docs)
      ) {
        return;
      }
      const apply = (docs, paths) => {
        docs.forEach(doc => {
          paths.forEach(path => {
            if (doc[path]) {
              doc[path].id = doc[path]._id;
            }
          });
        });
      };
      applySanitization(docs, apply);
    },

    sanitizePopulatedDocs(args) {
      let docs = args.results[args.options.customLabels.docs || 'docs'];
      let populateInputOptions = args.options.populate;
      if (
        !args.options.lean ||
        _.isEmpty(populateInputOptions) ||
        _.isEmpty(docs)
      ) {
        return;
      }
      const apply = (docs, paths) => {
        let docAtPath;
        docs.forEach(doc => {
          paths.forEach(path => {
            docAtPath = _.get(doc, path);
            if (docAtPath) {
              docAtPath.id = docAtPath._id;
            }
          });
        });
      };
      applySanitization(docs, apply);
    },

    attachPopulations(args) {
      if (_.isArray(args.options)) {
        args.options.forEach(option => {
          args.record.populate(option.path);
        });
      } else if (_.isObject(args.options)) {
        args.record.populate(args.options.path);
      } else {
        args.record.populate(args.options);
      }
      return args.record;
    },

    async executePopulate(args) {
      let doc = args.record;
      let populateOptions = args.options.populateOptions;
      if (_.isEmpty(doc) || _.isEmpty(populateOptions)) {
        return doc;
      }
      await doc.populate(populateOptions).execPopulate();
      return args.options.lean ? doc.toJSON() : doc;
    },

    async create(args, options = {}) {
      let record = await _model(args).save();
      if (options.populateOptions) {
        return await this.executePopulate({
          record,
          options,
        });
      }
      return options.lean ? record.toJSON() : record;
    },

    async createMany(args, options = {}) {
      let records = await _model.insertMany(args);
      if (options.populateOptions) {
        return await this.executePopulate({
          records,
          options,
        });
      }
      return options.lean ? records.map(record => record.toJSON()) : records;
    },

    async find(args) {
      let query = _model.findOne(args.query);
      if (args.selections) {
        query.select(args.selections);
      }
      let record = await query.exec();
      if (_.isEmpty(record)) {
        return record;
      }
      if (args.populateOptions) {
        return await this.executePopulate({
          records,
          options: args,
        });
      }
      return args.lean ? record.toJSON() : record;
    },

    async findOne(args) {
      let query = _model.findOne(args.query);
      if (args.selections) {
        query.select(args.selections);
      }
      let record = await query.exec();
      if (_.isEmpty(record)) {
        return record;
      }
      if (args.populateOptions) {
        return await this.executePopulate({
          record,
          options: args,
        });
      }
      return args.lean ? record.toJSON() : record;
    },

    async findOneAndUpdate(args) {
      let query = _model.findOneAndUpdate(
        args.query,
        args.updateQuery || { $set: args.dataToUpdate },
        args.options || DEFAULT_UPDATE_OPTIONS,
      );
      let record = await query.exec();
      if (_.isEmpty(record)) {
        return record;
      }
      if (args.populateOptions) {
        return await this.executePopulate({
          record,
          options: args,
        });
      }
      return args.lean ? record.toJSON() : record;
    },

    async findOneAndHardRemove(args) {
      let query = _model.findOneAndRemove(args.query);
      let record = await query.exec();
      if (_.isEmpty(record)) {
        return record;
      }
      if (args.populateOptions) {
        return await this.executePopulate({
          record,
          options: args,
        });
      }
      return args.lean ? record.toJSON() : record;
    },

    async paginate(args) {
      let results = await _model.paginate(args.query, args.pagingOptions);
      this.sanitizePopulatedDocs({
        results,
        options: args.pagingOptions,
      });
      return results;
    },

    async aggregate(args) {
      let results = await _model.aggregate(args.pipelines).exec();
      if (args.aggregator) {
        results = await args.aggregator(results);
      }
      return results;
    },
  };
};
