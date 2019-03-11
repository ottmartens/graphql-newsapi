const axios = require('axios');
const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');


const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    }

  })
})

const SourceType = new GraphQLObjectType({
  name: 'Source',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  })
})


const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    source: {
      type: SourceType
    },
    author: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    urlToImage: {
      type: GraphQLString
    },
    publishedAt: {
      type: GraphQLString
    },
    content: {
      type: GraphQLString
    }
  })
})

// Root Query
const RootQuery = new GraphQLObjectType({
  name:'RootQueryType',
  fields: {
    // customer: {
    //   type: CustomerType,
    //   args: {
    //     id: {
    //       type: GraphQLString
    //     },
    //   },
    //   resolve(parentValue, args){
    //     return axios.get('http://localhost:3000/customers/' + args.id)
    //       .then(res => res.data);
    //   }
    // },
    articles: {
      type: new GraphQLList(ArticleType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/all')
        .then(res => res.data)
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
});