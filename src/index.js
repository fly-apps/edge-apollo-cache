const BooksApi = require('./books-api');
const { ApolloServer, gql } = require('apollo-server');
const { RedisCache } = require('apollo-server-cache-redis');
const responseCachePlugin = require('apollo-server-plugin-response-cache');
const { ConnectionString } = require('connection-string');

// The schema defines the shape of data available
const typeDefs = gql`
  type Book {
    bib_key: String!
    thumbnail_url: String
    preview_url: String
    info_url: String
  }
  type SearchBook {
    isbn: [String]
    author_name: [String]
    contributor: [String]
    title: String
    first_publish_year: Int
  }
  type Query {
    book(bib_key: String!): Book
    search(search: String!, type: String): [SearchBook]
  }
`;

// Resolves the data based on the query performed
const resolvers = {
  Query: {
    book: async (_source, { bib_key }, { dataSources }) => {
      return dataSources.booksApi.getBook(bib_key);
    },
    search: async (_source, {search, type}, { dataSources }) => {
      return dataSources.booksApi.getSearchBooks(search, type);
    },
  },
};

// Redis cache connection credentials
let cache;

if (process.env.REDIS_HOST) {
  // When using docker-compose for local development
  cache = new RedisCache({ host: process.env.REDIS_HOST });
} else if (process.env.FLY_REDIS_CACHE_URL) {
  // When hosting on Fly
  const redisCredentials = new ConnectionString(process.env.FLY_REDIS_CACHE_URL);
  cache = new RedisCache({
    host: redisCredentials.hostname,
    port: redisCredentials.port,
    password: redisCredentials.password,
  });
}

const cacheControl = { defaultMaxAge: 3600 };

// Creates the Apollo Server with given definitions, resolvers, and cache objects
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ booksApi: new BooksApi() }),
  cache,
  cacheControl,
  plugins: [responseCachePlugin({ cache })],
});

const port = process.env.PORT || "8080";
// Launch the web server
server.listen({ port }).then(({ url }) => {
  console.log(`📚  Server ready at ${url}`);
});
