import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/graphql/**/*.{ts,tsx}'], // Más específico con la ubicación
  ignoreNoDocuments: true,
  generates: {
    './src/gql/types.ts': {  // Un solo archivo para tipos
      plugins: ['typescript'],
      config: {
        skipTypename: true,
        dedupeFragments: true,
      }
    },
    './src/gql/operations.ts': { // Archivo separado para operaciones
      preset: 'import-types',
      presetConfig: {
        typesPath: './types'
      },
      plugins: [
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        skipTypename: true,
        dedupeOperationSuffix: true
      }
    }
  }
};

export default config;