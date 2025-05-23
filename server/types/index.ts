interface Task {
    _id: string;
    title: string;
    description: string;
}

interface User extends Document {
    email: string;
    taskList: Task[];
}

export { Task, User }
