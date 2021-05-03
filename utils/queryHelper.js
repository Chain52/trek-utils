export default () => ({
  sanitizeQuery(args) {
    let query = args ? args.query : null;
    if (!query) {
      return args;
    }
    if (query.hasOwnProperty('id')) {
      if (query.id !== '-1') {
        query._id = query.id;
      }
      delete query.id;
    }
    return args;
  },

  sanitizeResults(args) {
    if (!query) {
      return args;
    }
    if (args instanceof Array) {
      let sanitizedResults = [];
      args.forEach(arg => sanitizedResults.push(arg.toJSON()));
      return sanitizedResults;
    }
    if (args instanceof Object) {
      return args.toJSON();
    }
    return args;
  },
});
