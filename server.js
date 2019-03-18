const express = require('express')
const expressGraphQL = require('express-graphql')
const mongoClient = require('mongodb').MongoClient
const cors = require('cors');

const { dbUrl } = require('./config')

const app = express();

app.use(cors());

mongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, database) => {

  console.log("Connected to database")

  const db = database.db('gql')

  const schema = require('./schema')(db)

  app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
  }))

  require('./newsService')(db)
  
  app.listen(80, () => {
    console.log("Listening on 80")
  })

})

