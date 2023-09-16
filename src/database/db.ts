import { connect } from "near-social-bridge/database";

// Public, but you can set it private using env vars
const dbName = "bos-todo-db-test";
const dbUser = "root";
const dbPass = "1234";

export const db = connect(dbName, dbUser, dbPass);
