const express = require('express');
const expressGraphQL = require('express-graphql');

const { flushAndFetch, clearData, fetchArticles } = require('./newsService');

const schema = require('./schema');

const app = express();

flushAndFetch();

setInterval(
  () => flushAndFetch(),
  1000 * 60 * 15
)

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true,
}))

app.listen(4000, () => {
  console.log("Listening on 4000");
})