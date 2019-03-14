const express = require('express')
const expressGraphQL = require('express-graphql')
const mongoClient = require('mongodb').MongoClient

const { dbUrl } = require('./config')

const app = express();


mongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, database) => {

  console.log("Connected to database")

  const db = database.db('gql')

  const schema = require('./schema')(db)

  app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
  }))

  require('./newsService')(db)
  
  app.listen(4000, () => {
    console.log("Listening on 4000")
  })

})

