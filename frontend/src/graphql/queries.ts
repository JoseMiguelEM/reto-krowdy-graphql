import { gql } from '@apollo/client';
import { 
  Task, 
  TaskFilterInput, 
  CreateTaskInput, 
  UpdateTaskInput,
  TaskStatus,
  Priority
} from '@/gql/types';

// Queries
export const TASKS_QUERY = gql`
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

export const TASK_STATUSES_QUERY = gql`
  query GetTaskStatuses {
    getAllTaskStatuses
  }
`;

export const TASK_PRIORITIES_QUERY = gql`
  query GetTaskPriorities {
    getAllPriorities
  }
`;

// Mutations
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: String!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
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

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id)
  }
`;

// Ejemplo de uso en componentes:
/*
import { useQuery, useMutation } from '@apollo/client';
import { TASKS_QUERY, CREATE_TASK_MUTATION } from '@/graphql/task.operations';

const Component = () => {
  // Query
  const { data, loading } = useQuery(TASKS_QUERY, {
    variables: {
      filters: {
        searchTerm: "búsqueda",
        status: TaskStatus.PENDING,
        priority: Priority.HIGH
      }
    }
  });

  // Mutation
  const [createTask] = useMutation(CREATE_TASK_MUTATION);

  const handleCreate = async () => {
    await createTask({
      variables: {
        input: {
          title: "Nueva tarea",
          description: "Descripción",
          priority: Priority.MEDIUM
        }
      }
    });
  };
}
*/