import { Field, ObjectType, InputType, ID, registerEnumType } from 'type-graphql';
import { Length, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estados posibles de una tarea',
});

registerEnumType(Priority, {
  name: 'Priority',
  description: 'Niveles de prioridad de una tarea',
});

@ObjectType()
export class Task {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => Priority, { nullable: true })
  priority?: Priority;

  @Field(() => Boolean)
  active!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
  title!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 500, { message: 'La descripción no puede exceder los 500 caracteres' })
  description?: string;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  active: boolean = true;
}

@InputType()
export class UpdateTaskInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 500, { message: 'La descripción no puede exceder los 500 caracteres' })
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}