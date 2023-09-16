import { TodoTicket } from "./database/ListTable";
import { Task as TaskTableType } from "./database/TodoTaskTable";

export type Task = TaskTableType;
export type Tickets = TodoTicket[];
export type Tasks = Task[];
