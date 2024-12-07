import { QuerySnapshot } from "firebase-admin/firestore";
import { TASK, TASKRESULT } from "../constant";
import { db } from "../firebase";
import { UDocument } from "../types/firebase";
import { UTask, UTaskResult } from "../types/task";
import { execute } from "../terminal";

export const getTasks = async () => {
  const server = process.env.SERVER ? process.env.SERVER.trim() : "debug";
  const collection = db.collection(TASK);
  const whereQuery = collection.where("data.server", "==", server);
  const orderQuery = whereQuery.orderBy("timestamp", "asc");
  const querySnapshot = await orderQuery.get();
  const docs = querySnapshot.docs;
  return docs.map((doc) => ({ ...doc.data(), id: doc.id } as UDocument<UTask>));
};

export const listenTasks = async (
  callback: (querySnapshot: QuerySnapshot) => void
) => {
  const server = process.env.SERVER ? process.env.SERVER.trim() : "debug";
  return db
    .collection(TASK)
    .where("data.server", "==", server)
    .orderBy("timestamp", "desc")
    .startAfter(Date.now())
    .onSnapshot(callback);
};

export const runTask = async (
  task: UDocument<UTask>,
  callback: (res: UTaskResult) => Promise<void>
) => {
  const commands = task.data.commands;
  if (!commands) return;
  for (let index = 0; index < commands.length; index++) {
    const command = commands[index];
    const [stdout, stderr, err] = await execute(command);
    const result = {} as UTaskResult;
    result.id = task.id;
    result.command = command;
    result.stdout = stdout;
    result.stderr = stderr;
    result.error = err;
    await callback(result);
  }
};

export const run = async (task: UDocument<UTask>) => {
  await runTask(task, async (result) => {
    if (task.data.isActive)
      await db.collection(TASK).doc(task.id).update({ "data.isActive": false });
    await db
      .collection(TASKRESULT)
      .add({ timestamp: Date.now(), data: result });
  });
};
