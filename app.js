const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const schema = require('./server/schema/schema');
// const testSchema = require('./server/schema/types_schema');

const app = express();
const port = process.env.PORT || 5000;

// `mongodb+srv://ryantalbert:${process.env.PASSWORD}@cluster0.vorsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const DB = process.env.MONGO_DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongo DB connection is live!');
  })
  .catch((e) => console.log(`Error: ${e}`));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
