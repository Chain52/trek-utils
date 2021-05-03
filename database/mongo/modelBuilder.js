import mongoose from 'mongoose';
import schemas from './schemas';

const build = model => {
  if (mongoose.models && mongoose.models[model.modelName]) {
    console.log(`Using cached model - ${model.collectionName}`);
    return mongoose.models[model.modelName];
  }
  console.log(`Building new model - ${model.collectionName}`);
  return mongoose.model(model.modelName, model.schema, model.collectionName);
};

export default {
  build,
  schemas,
};
