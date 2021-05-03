import { build } from '../schemaBuilder';
import _ from 'lodash';

//TODO: Add password handling to Schema

const schemaDef = {
  userId: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
};

const userSchema = build(schemaDef);

export default userSchema;
