const apiV1 = 'api/v1';

const commonSchemaOptions = {
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};
export { apiV1, commonSchemaOptions };
