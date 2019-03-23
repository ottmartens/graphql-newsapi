const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const ObjectID = require('mongodb').ObjectID;

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
      id: {
        type: GraphQLString,
      },
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
      article: {
        type: ArticleType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
          },
          category: {
            type: GraphQLString,
          }
        },
        resolve(parentValue, args) {
          const category = args.category || 'all';
          return fetchArticle(category, args.id);
          
        },
      },
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

  const fetchArticle = (collection, id) => {
    return new Promise((resolve, reject) => {
      db.collection(collection).findOne({ _id: ObjectID(id) }, (err, result) => {
        if (err) reject(err);
        else if (!result) reject('Article not found');
        else {
          delete Object.assign(result, { ['id']: result['_id'] })['_id'];
          resolve(result);
        }
      });
    });
  };

  const fetchArticles = collection => {
    return new Promise((resolve, reject) => {
      db.collection(collection)
        .find({})
        .toArray((err, result) => {
          if (err) {
            reject(err);
          }
          result.forEach(e => {
            delete Object.assign(e, { ['id']: e['_id'] })['_id'];
          });
          resolve(result);
        });
    });
  };

  return new GraphQLSchema({
    query: RootQuery,
  });
};
