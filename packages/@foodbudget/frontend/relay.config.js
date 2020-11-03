module.exports = {
  src: './src',
  schema: './schema.graphql',
  extensions: ['ts', 'tsx'],
  customScalars: {
    Email: 'String',
  },
  language: 'typescript',
};
