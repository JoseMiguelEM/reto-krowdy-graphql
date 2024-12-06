// Types from our backend
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
  
  export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: Priority;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Mock data
  export const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Implementar frontend con Next.js',
      description: 'Crear la interfaz de usuario usando Next.js y shadcn/ui',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      active: true,
      createdAt: new Date('2024-03-05T10:00:00'),
      updatedAt: new Date('2024-03-05T10:00:00')
    },
    {
      id: '2',
      title: 'Conectar con GraphQL backend',
      description: 'Integrar las queries y mutations de GraphQL en el frontend',
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      active: true,
      createdAt: new Date('2024-03-05T11:00:00'),
      updatedAt: new Date('2024-03-05T11:00:00')
    },
    {
      id: '3',
      title: 'Escribir documentación',
      description: 'Documentar la estructura del proyecto y cómo ejecutarlo',
      status: TaskStatus.PENDING,
      priority: Priority.LOW,
      active: true,
      createdAt: new Date('2024-03-05T12:00:00'),
      updatedAt: new Date('2024-03-05T12:00:00')
    },
    {
      id: '4',
      title: 'Implementar filtros de búsqueda',
      description: 'Añadir funcionalidad de filtrado en la lista de tareas',
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      active: true,
      createdAt: new Date('2024-03-05T13:00:00'),
      updatedAt: new Date('2024-03-05T13:00:00')
    }
  ];