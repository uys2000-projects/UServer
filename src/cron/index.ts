import cron, { type ScheduledTask } from "node-cron";
import { UDocument } from "../types/firebase";
import { UTask } from "../types/task";
import { run } from "../function/executer";

let tasks: Record<string, ScheduledTask> = {};

const options = {
  scheduled: true,
  timezone: "Europe/Istanbul",
};

export const schedule = (task: UDocument<UTask>) => {
  tasks[task.id] = cron.schedule(
    task.data.cronExpression,
    async () => run(task),
    options
  );
};

export const unschedule = (script: UDocument<UTask>) => {
  tasks[script.id]?.stop();
};
