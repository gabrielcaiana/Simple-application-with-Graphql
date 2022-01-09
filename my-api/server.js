const { ApolloServer, gql } = require('apollo-server');

const schema = gql(`
  type Query {
    currentUser: User
    postsByUser(userId: String!): [Post]
  }

  type User {
    id: ID!
    username: String!
    age: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    content: String!
    userId: ID!
  }
`)

const data = {};

data.posts = [
  { 
    id: 'xyz-1',
    content: "First Post - Hello world",
    userId: '1',
  },
  {
    id: 'xyz-2',
    content: "Second Post - Hello again",
    userId: '1',
  },
  {
    id: 'xyz-3',
    content: "Random Post",
    userId: '2',
  }
];

data.users = [
  {
    id: '1', 
    username: "Gabriel Caiana",
    age: '25'
  },
  {
    id: '2', 
    username: "Gisely Almeida",
    age: '26'
  }
];

const currentUserId = '1';

const resolvers = {
  Query: {
    currentUser: (_, __, { data, currentUserId}) => {
      let user = data.users.find( u => u.id === currentUserId );
      return user;
    },
    postsByUser: (_, args, { data }) => {
      let posts = data.posts.filter( p => p.userId === args.userId ); 
      return posts
    },
  },

  User: {
    posts: (parent, __, { data }) => {
      let posts = data.posts.filter( p => p.userId === parent.id );
      return posts;
    }
  }
};

const server = new ApolloServer({ 
  typeDefs: schema, 
  resolvers: resolvers,
  context: {
    currentUserId,
    data
  }
});

server.listen(4001).then(({ url }) => {
  console.log('API server running at localhost:4001');
});