import { UDocument } from "../types/firebase";
import { UError, UTaskResult, UTaskType } from "../types/task";

export const getData = (
  id: string,
  type: UTaskType,
  stdout: string,
  stderr: string
): UDocument<UTaskResult> => {
  return {
    id: "",
    data: {
      id: id,
      type: type,
      stderr: stderr,
      stdout: stdout,
    },
    active: true,
    timestamp: Date.now(),
    utimestamp: Date.now(),
  };
};

export const getError = (
  err: any,
  stdout: string,
  stderr: string,
  id?: string
): UDocument<UError> => {
  return {
    id: "",
    data: {
      id: id,
      error: err,
      stdout: stdout,
      stderr: stderr,
    },
    active: true,
    timestamp: Date.now(),
    utimestamp: Date.now(),
  };
};
