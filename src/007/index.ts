import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const solve1 = (positions: number[]): number => {
  const max = Math.max(...positions);
  const min = Math.min(...positions);

  let bestScore = Infinity;
  let bestValue = -1;

  for (let i = min; i < max; i += 1) {
    const score = positions
      .map((position) => Math.abs(i - position))
      .reduce((subtotal, x) => subtotal + x);

    if (score < bestScore) {
      bestScore = score;
      bestValue = i;
    }
  }

  return bestScore;
};

const solve2 = (positions: number[]): number => {
  const max = Math.max(...positions);
  const min = Math.min(...positions);

  let bestScore = Infinity;
  let bestValue = -1;

  for (let i = min; i < max; i += 1) {
    const score = positions
      .map((position) => {
        const distance = Math.abs(i - position);
        return (distance * (distance + 1)) / 2;
      })
      .reduce((subtotal, x) => subtotal + x);

    if (score < bestScore) {
      bestScore = score;
      bestValue = i;
    }
  }

  return bestScore;
};

const parse = ([line]: string[]): number[] =>
  line.split(",").map((s) => parseInt(s, 10));

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day7: Day<
  ReturnType<typeof getPuzzleInput>,
  ReturnType<typeof parse>,
  ReturnType<typeof solve1>
> = {
  getSimpleInput,
  getPuzzleInput,
  parse,
  part1: {
    answers: { simple: 1, puzzle: 349549 },
    solve: solve1,
  },
  part2: {
    answers: { simple: 1, puzzle: 1589590444365 },
    solve: solve2,
  },
};

export default day7;
