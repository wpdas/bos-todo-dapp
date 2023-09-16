import { db } from "./db";

export type Task = {
  id: number;
  description: string;
  finished: boolean;
};

class TodoTaskTable {
  public tasks: Task[] = [];
}

export const todoTaskTable = async (accountId: string, ticketId: number) =>
  db.get_table(`todo-task-${accountId}-${ticketId}`, new TodoTaskTable());
