export type TodoFilter = {
  status: string | null;
  assignee: string | null;
  startDate: string;
  endDate: string;
  perPage?: number;
  page?: number;
  order?: {
    key: string,
    order: string
  };
};

export type IUser = {
  id: string;
  name: string;
}

export type TodoUser = {
  todoId: string;
  userId: string;
  user: IUser
}

export type TodoData = {
  id: string;
  name: string;
  todoAppId: string;
  companyId: string;
  appTodoId: string;
  appUrl: number;
  appCreatedAt: string;
  isDone: boolean;
  isClosed: boolean;
  appCreatedBy: string;
  startDate: string;
  deadline: string;
  todoUsers: TodoUser[];
};
