module.exports = {
  src: './src',
  schema: '../backend/api/src/schema.graphql',
  extensions: ['ts', 'tsx'],
  customScalars: {
    Email: 'String',
  },
  language: 'typescript',
};
