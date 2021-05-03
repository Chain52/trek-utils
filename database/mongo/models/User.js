import modelBuilder from '../modelBuilder';
import modelRegistry from '../modelRegistry';

const loadReferences = () => {
  console.log('Loading User Reference Models...');
  //TODO: Create Reference Models
};

const modelConfig = {
  modelName: modelRegistry.User,
  schema: modelBuilder.schemas.userSchema,
  collectionName: 'users',
};

export default () => {
  loadReferences();
  return modelBuilder.build(modelConfig);
};
