interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  createdAt?: string;
}


interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  linkedInUrl: string;
  linkedinFullName: string;
  linkedinHeadline: string;
  linkedinProfilePicture: string;
  taskList: Task[];
  createdAt: string;
}

export type { Task, UserProfile };