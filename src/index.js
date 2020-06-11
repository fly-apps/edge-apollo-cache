const { ApolloServer, gql } = require('apollo-server');
const { RedisCache } = require('apollo-server-cache-redis');

// The schema defines the shape of data available
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;

// The actual data for this app
const books = [
  {
    title: 'The Wind-Up Bird Chronicle',
    author: 'Haruki Murakami',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
  {
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway',
  },
];

// Resolves the data based on the query performed
const resolvers = {
  Query: {
    books: () => books,
  },
};

// Redis cache connection credentials and max age
const cache = new RedisCache({
  host: process.env.FLY_REDIS_CACHE_URL,
});
const cacheControl = { defaultMaxAge: 30 };

// Creates the Apollo Server with given definitions, resolvers, and cache objects
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
  cacheControl,
});

// Launch the web server
server.listen().then(({ url }) => {
  console.log(`📚  Server ready at ${url}`);
});
