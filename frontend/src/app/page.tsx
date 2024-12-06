"use client";

import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks efficiently
          </p>
        </header>
        
        <TaskList />
      </div>
    </main>
  );
}