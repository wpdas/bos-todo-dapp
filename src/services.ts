import { listTable, todoTaskTable } from "./database";
import { TodoTicket } from "./database/ListTable";

interface CreateTicketPayload {
  name: string;
}

interface DeleteTicketPayload {
  ticketId: number;
}

interface CreateTaskPayload {
  ticketId: number;
  description: string;
}

type GetTasksPayload = {
  ticketId: number;
};

interface EditTaskPayload {
  ticketId: number;
  taskId: number;
  finished: boolean;
}

interface DeleteTaskPayload {
  ticketId: number;
  taskId: number;
}

let accountId = "";

export const setAccount = (_accountId: string) => {
  if (_accountId && !accountId) {
    accountId = _accountId;
  }
};

// Create Ticket
export const createTicket = async (payload: CreateTicketPayload) => {
  const todoList = await listTable(accountId!);
  const newTicket: TodoTicket = {
    ticketId: Date.now(),
    name: payload.name,
  };
  todoList.table.todoTickets = [...todoList.table.todoTickets, newTicket];
  await todoList.persist();
  return todoList.table.todoTickets;
};

// Get Ticket List
export const getTicketList = async () => {
  const todoList = await listTable(accountId!);
  return todoList.table.todoTickets;
};

// Delete Ticket
export const deleteTicket = async (payload: DeleteTicketPayload) => {
  const todoList = await listTable(accountId!);
  // Remove ticket
  todoList.table.todoTickets = todoList.table.todoTickets.filter(
    (ticket) => ticket.ticketId !== payload.ticketId
  );
  await todoList.persist();
  return todoList.table.todoTickets;
};

// Create Task
export const createTask = async (payload: CreateTaskPayload) => {
  const todoTask = await todoTaskTable(accountId!, payload.ticketId);
  todoTask.table.tasks.push({
    id: Date.now(),
    description: payload.description,
    finished: false,
  });
  await todoTask.persist();
  return todoTask.table.tasks;
};

// Get Task
export const getTasks = async (payload: GetTasksPayload) => {
  const todoTask = await todoTaskTable(accountId!, payload.ticketId);
  return todoTask.table.tasks;
};

// Edit Task
export const editTask = async (payload: EditTaskPayload) => {
  const todoTask = await todoTaskTable(accountId!, payload.ticketId);
  const tasks = todoTask.table.tasks.map((task) => {
    if (task.id === payload.taskId) {
      task.finished = payload.finished;
    }
    return task;
  });
  todoTask.table.tasks = tasks;
  await todoTask.persist();
  return todoTask.table.tasks;
};

// Delete Task
export const deleteTask = async (payload: DeleteTaskPayload) => {
  const todoTask = await todoTaskTable(accountId!, payload.ticketId);
  const tasks = todoTask.table.tasks.filter(
    (task) => task.id !== payload.taskId
  );
  todoTask.table.tasks = tasks;
  await todoTask.persist();
  return todoTask.table;
};
