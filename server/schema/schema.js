const graphql = require('graphql');
const _ = require('lodash');
const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// THESE ARE THE BASICS TO CREATE A GRAPHQL BACKEND

// dummy data
var usersData = [
  {
    id: '1',
    name: 'Bond',
    age: 36,
    car: 'Aston Martin',
    profession: 'Programmer',
  },
  { id: '13', name: 'Anna', age: 26, car: 'Lancia', profession: 'Baker' },
  { id: '211', name: 'Bella', age: 16, car: 'Ford', profession: 'Mechanic' },
  { id: '19', name: 'Gina', age: 26, car: 'Dodge', profession: 'Painter' },
  {
    id: '150',
    name: 'Georgina',
    age: 36,
    car: 'Pantera',
    profession: 'Teacher',
  },
];

var hobbiesData = [
  {
    id: '1',
    title: 'Programming',
    description: 'Using computers to make the world a better place',
    userId: '1',
  },
  {
    id: '2',
    title: 'Rowing',
    description: 'Sweat and feel better before eating donuts',
    userId: '150',
  },
  {
    id: '3',
    title: 'Swimming',
    description: 'Get in the water and learn to become the water',
    userId: '13',
  },
  {
    id: '4',
    title: 'Fencing',
    description: 'A hobby for fancy people',
    userId: '211',
  },
  {
    id: '5',
    title: 'Hiking',
    description: 'Wear hiking boots and explore the world',
    userId: '19',
  },
];

var postsData = [
  { id: '1', comment: 'Building a Mind', userId: '1' },
  { id: '2', comment: 'GraphQL is Amazing', userId: '1' },
  { id: '3', comment: 'How to change the world', userId: '19' },
  { id: '4', comment: 'How to change the world', userId: '211' },
  { id: '5', comment: 'How to change the world', userId: '1' },
];

// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    car: { type: GraphQLString },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby description',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.find({ userId: args.id });
      },
    },
  }),
});

// Post type (id, comment)
const PostType = new GraphQLObjectType({
  name: 'Posts',
  description: 'This is where all the posts are stored...',
  fields: () => ({
    id: { type: GraphQLString },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId });
      },
    },
  }),
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // we resolve with data
        // get and return from a datasource
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return usersData;
      },
    },

    hobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return data for our hobby
        return _.find(hobbiesData, {
          id: args.id,
        });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return hobbiesData;
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(postsData, { id: args.id });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return postsData;
      },
    },
  },
});

// Mutations (modify data)
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        // id: {type: GraphQLID}
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        let user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        return user.save();
      },
    },
    // Update User
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true }
        );
      },
    },
    removeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return User.findByIdAndDelete(args.id);
      },
    },

    createPost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let post = Post({
          comment: args.comment,
          userId: args.userId,
        });

        return post.save();
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Post.findByIdAndUpdate(
          args.id,
          {
            comment: args.comment,
            userId: args.userId,
          },
          { new: true }
        );
      },
    },
    removePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Post.findByIdAndDelete(args.id).exec();
      },
    },
    createHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });

        return hobby.save();
      },
    },
    updateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Hobby.findByIdAndUpdate(args.id, {
          title: args.title,
          description: args.description,
        });
      },
    },
    removeHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Hobby.findByIdAndDelete(args.id).exec();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
