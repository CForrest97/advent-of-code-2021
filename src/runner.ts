import { prompt } from "enquirer";
import * as days from ".";

export type Day<I, P, R> = {
  getSimpleInput: () => I;
  getPuzzleInput: () => I;
  parse: (input: I) => P;
  part1: {
    answers: {
      simple: R;
      puzzle: R;
    };
    solve: (parsedInput: P) => R;
  };
  part2: {
    answers: {
      simple: R;
      puzzle: R;
    };
    solve: (parsedInput: P) => R;
  };
};

const chooseDay = async (): Promise<typeof days.day1> => {
  const response = await prompt({
    type: "select",
    choices: Object.keys(days),
    message: "Choose a day",
    name: "day",
  });

  return days[(response as any).day];
};

const chooseInput = async (): Promise<"puzzle" | "simple"> => {
  const response = await prompt({
    type: "select",
    choices: ["puzzle", "simple"],
    message: "Choose an input",
    name: "input",
  });

  return (response as any).input;
};

const run = async () => {
  const day = await chooseDay();
  const chosenInput = await chooseInput();

  const { getSimpleInput, getPuzzleInput, parse, part1, part2 } = day;
  const input = chosenInput === "puzzle" ? getPuzzleInput() : getSimpleInput();

  const startTime = new Date().valueOf();
  const parsedInput = parse(input);
  const parsedTime = new Date().valueOf();
  const solution1 = part1.solve(parsedInput);
  const solved1Time = new Date().valueOf();
  const solution2 = part2.solve(parsedInput);
  const solved2Time = new Date().valueOf();

  console.log({
    part1: {
      solution: solution1,
      expectedAnswer:
        chosenInput === "puzzle" ? part1.answers.puzzle : part1.answers.simple,
    },
    part2: {
      solution: solution2,
      expectedAnswer:
        chosenInput === "puzzle" ? part2.answers.puzzle : part2.answers.simple,
    },
    timings: {
      parsing: parsedTime - startTime,
      solvingPart1: solved1Time - parsedTime,
      solvingPart2: solved2Time - solved1Time,
      total: solved2Time - parsedTime,
    },
  });
};

run();
