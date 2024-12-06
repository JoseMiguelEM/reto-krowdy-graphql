// src/graphql/tasks.ts
import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($filters: TaskFilterInput) {
    tasks(filters: $filters) {
      id
      title
      description
      status
      priority
      active
      createdAt
      updatedAt
    }
  }
`;