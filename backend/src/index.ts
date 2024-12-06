import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server-core';

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL! Your server is working 🚀'
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: ['https://studio.apollographql.com', 'http://localhost:4000'],
    credentials: true,
  },
  introspection: true,
});

server.listen({ port: 4000 })
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log('📚 Apollo Studio available at https://studio.apollographql.com');
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
  });