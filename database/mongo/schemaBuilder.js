//TODO: Check mongoose plugins
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const getSchema = () => {
  return Schema;
};

const build = schema => {
  const builtSchema = new Schema(schema);
  builtSchema.vertual('id').get(() => {
    return this._id;
  });
  builtSchema.set('toJSON', { virtuals: true });
  return builtSchema;
};

const buildReference = (referenceSchema, options) => {
  return {
    type: Schema.Types.ObjectId,
    ref: referenceSchema.modelName,
    ...options,
  };
};

export { build, buildReference, getSchema };
