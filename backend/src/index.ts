import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { TaskResolver } from './TaskResolver';

const configureApollo = (schema: any) => {
  return new ApolloServer({
    schema,
    cors: {
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    },
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
  });
};

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [TaskResolver],
    validate: true,
  });

  const server = configureApollo(schema);

  const { url } = await server.listen(4000);
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});