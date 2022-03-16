const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

// scalar type
/* 
  String = GraphQLString
  int 
  Float
  Boolean
  ID
*/

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'Represents a person type',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    isMarried: { type: GraphQLBoolean },
    gpa: { type: GraphQLFloat },

    justAType: {
      type: Person,
      resolve(parent, args) {
        return parent;
      },
    },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    person: {
      type: Person,
      resolve(parent, args) {
        let personobj = {
          name: 'antonio',
          age: 34,
          isMarried: true,
          gpa: 4.0,
        };
        return personobj;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
