// src/types.ts

// Type for Task
export type Task = {
    id: number;
    title: string;
    description: string;
    status: "To Do" | "In Progress" | "Completed";
  };
  
  // Type for TeamMember
  export type TeamMember = {
    id: number;
    name: string;
    role: string;
    bio: string;
    tasks: Task[];
  };
  


  export interface Member {

    id: number;
  
    name: string;
  
    role: string;
  
  }
  
  