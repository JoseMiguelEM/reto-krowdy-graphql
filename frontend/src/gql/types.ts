export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type CreateTaskInput = {
  active?: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Priority>;
  title: Scalars['String']['input'];
};

export type Mutation = {
  createTask: Task;
  deleteTask: Scalars['Boolean']['output'];
  updateTask?: Maybe<Task>;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateTaskArgs = {
  id: Scalars['String']['input'];
  input: UpdateTaskInput;
};

/** Niveles de prioridad de una tarea */
export enum Priority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type Query = {
  /** Obtener todas las prioridades posibles de una tarea */
  getAllPriorities: Array<Scalars['String']['output']>;
  /** Obtener todos los estados posibles de una tarea */
  getAllTaskStatuses: Array<Scalars['String']['output']>;
  getTask?: Maybe<Task>;
  tasks: Array<Task>;
};


export type QueryGetTaskArgs = {
  id: Scalars['String']['input'];
};


export type QueryTasksArgs = {
  filters?: InputMaybe<TaskFilterInput>;
};

export type Task = {
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  priority?: Maybe<Priority>;
  status: TaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type TaskFilterInput = {
  priority?: InputMaybe<Priority>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatus>;
};

/** Estados posibles de una tarea */
export enum TaskStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type UpdateTaskInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Priority>;
  status?: InputMaybe<TaskStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};
