import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { TaskResolver } from './TaskResolver.js';

const configureApollo = (schema: any) => {
  return new ApolloServer({
    schema,
    cors: {
      origin: ['https://studio.apollographql.com', 'http://localhost:4000'],
      credentials: true,
    },
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
    formatError: (error) => {
      console.error(error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      };
    },
  });
};

async function bootstrap() {
  const schemaOptions: BuildSchemaOptions = {
    resolvers: [TaskResolver],
    validate: true,
  };

  const schema = await buildSchema(schemaOptions);
  const server = configureApollo(schema);

  const { url } = await server.listen(4000);
  console.log(`🚀 Server ready at ${url}`);
  console.log('📚 Apollo Studio available at https://studio.apollographql.com');
}

bootstrap().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});