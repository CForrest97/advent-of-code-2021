import assert from "assert";
import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Target = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const isSuccesfulLaunch = (
  target: Target,
  deltaX: number,
  deltaY: number
): boolean => {
  let y = 0;
  let x = 0;

  let updatedDeltaX = deltaX;
  let updatedDeltaY = deltaY;
  while (y >= target.minY) {
    if (
      x >= target.minX &&
      x <= target.maxX &&
      y >= target.minY &&
      y <= target.maxY
    ) {
      return true;
    }

    y += updatedDeltaY;
    x += updatedDeltaX;
    updatedDeltaX = Math.max(updatedDeltaX - 1, 0);
    updatedDeltaY -= 1;
  }

  return false;
};

const solve1 = ({ minX, maxX, minY, maxY }: Target): number => {
  const minDeltaX = 1;
  const maxDeltaX = maxX;

  let bestDeltaY = -Infinity;

  let goodLaunches = 0;
  // console.log(" =>>>>", isSuccesfulLaunch({ minX, maxX, minY, maxY }, 6, 9));

  for (let deltaX = minDeltaX; deltaX <= maxDeltaX; deltaX += 1) {
    const minDeltaY = minY;
    const maxDeltaY = 150;

    for (let deltaY = minDeltaY; deltaY <= maxDeltaY; deltaY += 1) {
      if (isSuccesfulLaunch({ minX, maxX, minY, maxY }, deltaX, deltaY)) {
        bestDeltaY = Math.max(bestDeltaY, deltaY);
        goodLaunches += 1;
      }
    }
  }

  let solution = 0;
  for (let i = 0; i <= bestDeltaY; i++) {
    solution += i;
  }

  return goodLaunches;
};

const solve2 = ({ minX, maxX, minY, maxY }: Target): number => 1;

const parse = ([line]: string[]): Target => {
  const match = line.match(/target area: x=(\d+)..(\d+), y=(-\d+)..(-\d+)/);
  assert(match, `cannot parse line ${line}`);
  const [, minX, maxX, minY, maxY] = match;

  return {
    maxX: parseInt(maxX, 10),
    maxY: parseInt(maxY, 10),
    minX: parseInt(minX, 10),
    minY: parseInt(minY, 10),
  };
};

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
