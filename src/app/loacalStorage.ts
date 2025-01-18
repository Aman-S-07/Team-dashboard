// utils/localStorage.ts

interface TeamMember {
  id: string;
  name: string;
  role?: string;
}


export const getTeamMembers = () => {
    const members = localStorage.getItem('teamMembers');
    return members ? JSON.parse(members) : [];
  };
  
  export const saveTeamMembers = (members: TeamMember[]) => {
    localStorage.setItem('teamMembers', JSON.stringify(members));
  };
  
  // Removed duplicate declarations
  

interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
  }
  

export const saveTasks = (tasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };
  
  export const getTasks = (): Task[] => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  };
  