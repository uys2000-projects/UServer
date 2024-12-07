import "dotenv/config";
import { getTasks, listenTasks, run } from "./function/executer";
import { UDocument } from "./types/firebase";
import { UTask } from "./types/task";
import { schedule, unschedule } from "./cron";
import { execute } from "./terminal";

(async () => {
  const server = process.env.SERVER ? process.env.SERVER : "debug";
  console.log("ServerCodeName: " + server);
  const activeTasks = [] as UDocument<UTask>[];
  const startTasks = [] as UDocument<UTask>[];
  const cronTasks = [] as UDocument<UTask>[];
  const tasks = await getTasks();

  tasks.forEach((task) => {
    if (task.data.isStartup) startTasks.push(task);
    if (task.data.isActive) activeTasks.push(task);
    if (task.data.isCron) cronTasks.push(task);
  });

  for (let index = 0; index < startTasks.length; index++) {
    const startTask = startTasks[index];
    console.log("Starup Task: " + startTask.id);
    await run(startTask);
  }

  for (let index = 0; index < cronTasks.length; index++) {
    const cronTask = cronTasks[index];
    console.log("Cron Task: " + cronTask.id);
    schedule(cronTask);
  }

  for (let index = 0; index < activeTasks.length; index++) {
    const activeTask = activeTasks[index];
    console.log("Active Task: " + activeTask.id);
    await run(activeTask);
  }

  listenTasks(async (querySnapshot) => {
    const changes = querySnapshot.docChanges();
    for (let index = 0; index < changes.length; index++) {
      const change = changes[index];
      const task = {
        ...change.doc.data(),
        id: change.doc.id,
      } as UDocument<UTask>;

      const l = `Task: ${task.id} Cron: ${task.data.isCron} Run: ${task.data.isActive}`;
      console.log(l);
      if (task.data.isCron) {
        if (change.type == "removed") unschedule(task);
        else if (change.type == "added") schedule(task);
        else if (change.type == "modified") {
          unschedule(task);
          schedule(task);
        }
      }
      if (change.type == "modified" && task.data.isActive) run(task);
    }
  });
})(); //.catch((err) => execute("sudo reboot"));
