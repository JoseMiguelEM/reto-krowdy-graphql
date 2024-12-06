import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql', // URL de tu backend GraphQL
  documents: ['src/**/*.tsx', 'src/**/*.ts'], // Archivos donde buscar queries/mutations
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;