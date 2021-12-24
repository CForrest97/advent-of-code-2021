import { readFileSync } from "fs";

export const readLines = (path: string): string[] =>
  readFileSync(path).toString().split("\n").slice(0, -1);
