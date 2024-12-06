import { Resolver, Query, Mutation, Arg, InputType, Field } from 'type-graphql';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, Priority } from './Task';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class TaskFilterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}


@Resolver(of => Task)
export class TaskResolver {
  private tasks: Task[] = [];

  @Query(returns => [Task], { name: 'tasks' })
  async getAllTasks(
    @Arg('filters', { nullable: true }) filters?: TaskFilterInput
  ): Promise<Task[]> {
    return this.tasks.filter(task => {
      if (!task.active) return false;
      
      // Si no hay filtros, devolver todas las tareas activas
      if (!filters) return true;
      
      const { searchTerm, status, priority } = filters;
      
      // Búsqueda por término en título y descripción
      const matchesSearch = !searchTerm || (
        (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Filtro por status
      const matchesStatus = !status || task.status === status;
      
      // Filtro por priority
      const matchesPriority = !priority || task.priority === priority;
      
      // La tarea debe cumplir con todos los filtros aplicados
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  @Query(returns => Task, { nullable: true })
  async getTask(@Arg('id') id: string): Promise<Task | null> {
    return this.tasks.find(task => task.id === id && task.active) || null;
  }

  @Mutation(returns => Task)
  async createTask(@Arg('input') input: CreateTaskInput): Promise<Task> {
    const task: Task = {
      id: Date.now().toString(),
      ...input,
      status: TaskStatus.PENDING,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.tasks.push(task);
    return task;
  }

  @Mutation(returns => Task, { nullable: true })
  async updateTask(
    @Arg('id') id: string,
    @Arg('input') input: UpdateTaskInput
  ): Promise<Task | null> {
    const index = this.tasks.findIndex(task => task.id === id && task.active);
    if (index === -1) return null;

    const updatedTask = {
      ...this.tasks[index],
      ...input,
      updatedAt: new Date()
    };

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  @Mutation(returns => Boolean)
  async deleteTask(@Arg('id') id: string): Promise<boolean> {
    const index = this.tasks.findIndex(task => task.id === id && task.active);
    if (index === -1) return false;

    this.tasks[index] = {
      ...this.tasks[index],
      active: false,
      updatedAt: new Date()
    };
    
    return true;
  }
  @Query(returns => [String], { description: 'Obtener todos los estados posibles de una tarea' })
  async getAllTaskStatuses(): Promise<string[]> {
    return Object.values(TaskStatus);
  }

  @Query(returns => [String], { description: 'Obtener todas las prioridades posibles de una tarea' })
  async getAllPriorities(): Promise<string[]> {
    return Object.values(Priority);
  }
}