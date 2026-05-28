import store from "./store.js";

export const { User, Message } = store;
export const useMongo = false;

export async function connectDB() {
  console.log("[Snapverse-Pro] Using file store (no MongoDB)");
}
