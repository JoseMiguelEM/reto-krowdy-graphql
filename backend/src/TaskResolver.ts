import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from './Task';

@Resolver(of => Task)
export class TaskResolver {
  private tasks: Task[] = [];

  @Query(returns => [Task])
  async getTasks(
    @Arg('searchTerm', { nullable: true }) searchTerm?: string,
    @Arg('status', { nullable: true }) status?: TaskStatus
  ): Promise<Task[]> {
    return this.tasks.filter(task => {
      if (!task.active) return false;
      
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = !status || task.status === status;
      
      return matchesSearch && matchesStatus;
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
}