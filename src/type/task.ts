export type Task = {
  id: string;
  text: string;
};

export type TaskList = {
  id: string;
  name: string;
  tasks: Task[];
};
