import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Command = {
  action: "up" | "down" | "forward";
  amount: number;
};

const solve1 = (commands: Command[]): number => {
  const moveUpCommands = commands.filter(({ action }) => action === "up");
  const moveDownCommands = commands.filter(({ action }) => action === "down");
  const moveForwardCommands = commands.filter(
    ({ action }) => action === "forward"
  );

  const moveUpDistance = moveUpCommands
    .map(({ amount }) => amount)
    .reduce((subTotal, d) => subTotal + d);
  const moveDownDistance = moveDownCommands
    .map(({ amount }) => amount)
    .reduce((subTotal, d) => subTotal + d);
  const moveForwardDistance = moveForwardCommands
    .map(({ amount }) => amount)
    .reduce((subTotal, d) => subTotal + d);

  return moveForwardDistance * (moveDownDistance - moveUpDistance);
};

const solve2 = (commands: Command[]): number => {
  let depth = 0;
  let horizontalPosition = 0;
  let aim = 0;

  commands.forEach((command) => {
    switch (command.action) {
      case "down":
        aim += command.amount;
        break;
      case "up":
        aim -= command.amount;
        break;
      case "forward":
        horizontalPosition += command.amount;
        depth += command.amount * aim;
        break;
      default:
    }
  });

  return horizontalPosition * depth;
};

const parse = (lines: string[]): Command[] =>
  lines.map((s) => ({
    action: s.slice(0, s.indexOf(" ")) as Command["action"],
    amount: parseInt(s.slice(s.indexOf(" ") + 1), 10),
  }));

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day2: Day<
  ReturnType<typeof getPuzzleInput>,
  ReturnType<typeof parse>,
  ReturnType<typeof solve1>
> = {
  getSimpleInput,
  getPuzzleInput,
  parse,
  part1: {
    answers: { simple: 1, puzzle: 1855814 },
    solve: solve1,
  },
  part2: {
    answers: { simple: 1, puzzle: 1845455714 },
    solve: solve2,
  },
};

export default day2;
