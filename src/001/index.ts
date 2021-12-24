import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const solve1 = (depths: number[]): number =>
  depths
    .slice(0, -1)
    .map((d, i) => depths[i + 1] > d)
    .filter(Boolean).length;

const solve2 = (depths: number[]): number =>
  depths
    .slice(0, -3)
    .map((d, i) => depths[i + 3] > d)
    .filter(Boolean).length;

const parse = (lines: string[]): number[] => lines.map((s) => parseInt(s, 10));

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day1: Day<
  ReturnType<typeof getPuzzleInput>,
  ReturnType<typeof parse>,
  ReturnType<typeof solve1>
> = {
  getSimpleInput,
  getPuzzleInput,
  parse,
  part1: {
    answers: {
      simple: 1,
      puzzle: 7,
    },
    solve: solve1,
  },
  part2: {
    answers: {
      simple: 5,
      puzzle: 1065,
    },
    solve: solve2,
  },
};

export default day1;
