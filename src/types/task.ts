import { type ExecException } from "child_process";
export interface UTask {
  name: string;
  isActive: boolean;
  isStartup: boolean;
  isCron: boolean;
  server: string;
  cronExpression: string;
  commands: string[];
}

export interface UTaskResult {
  id: string;
  command: string;
  stdout: string;
  stderr: string;
  error: string;
}
