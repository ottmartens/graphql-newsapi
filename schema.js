const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');

module.exports = db => {
  const SourceType = new GraphQLObjectType({
    name: 'Source',
    fields: () => ({
      id: {
        type: GraphQLString,
      },
      name: {
        type: GraphQLString,
      },
    }),
  });

  const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
      source: {
        type: SourceType,
      },
      author: {
        type: GraphQLString,
      },
      title: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
      url: {
        type: GraphQLString,
      },
      urlToImage: {
        type: GraphQLString,
      },
      publishedAt: {
        type: GraphQLString,
      },
      content: {
        type: GraphQLString,
      },
    }),
  });

  // Root Query
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      articles: {
        type: new GraphQLList(ArticleType),
        args: {
          category: {
            type: GraphQLString,
          },
        },
        resolve(parentValue, args) {
          const category = args.category || 'all';
          return fetchArticles(category);
        },
      },
    },
  });

  const fetchArticles = collection => {
    return new Promise((resolve, reject) => {
      db.collection(collection)
        .find({})
        .toArray((err, result) => {
          if (err) {
            reject(err);
          }
          result.forEach(e => {
            delete e._id;
          });
          resolve(result);
        });
    });
  };

  return new GraphQLSchema({
    query: RootQuery,
  });
};
