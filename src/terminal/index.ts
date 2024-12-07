import { exec, type ExecException } from "child_process";

export const execute = (
  command: string
): Promise<[stdout: string, stderr: string, err: string]> =>
  new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      return resolve([stdout, stderr, JSON.stringify(err)] as [
        string,
        string,
        string
      ]);
    });
  });
