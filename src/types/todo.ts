export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type CreateTodoDto = Pick<Todo, "title" | "user_id">;
export type UpdateTodoDto = Partial<Pick<Todo, "title" | "completed">>;

export interface TodoWithUser extends Todo {
  user: {
    email: string;
    full_name?: string;
  };
}
