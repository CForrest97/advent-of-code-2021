import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const updateOctopus = (grid: number[][], x: number, y: number): number => {
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length) {
    return;
  }

  // eslint-disable-next-line no-param-reassign
  grid[y][x] += 1;
  if (grid[y][x] > 9) {
    // eslint-disable-next-line no-param-reassign
    grid[y][x] = -Infinity;
    updateOctopus(grid, x - 1, y - 1);
    updateOctopus(grid, x, y - 1);
    updateOctopus(grid, x + 1, y - 1);
    updateOctopus(grid, x - 1, y);
    updateOctopus(grid, x + 1, y);
    updateOctopus(grid, x - 1, y + 1);
    updateOctopus(grid, x, y + 1);
    updateOctopus(grid, x + 1, y + 1);
  }
};

const solve1 = (grid: number[][]): number => {
  let numberOfFlashes = 0;

  for (let i = 0; i < 20000; i += 1) {
    let numberOfFlashesThisRound = 0;
    for (let y = 0; y < grid.length; y += 1) {
      for (let x = 0; x < grid[y].length; x += 1) {
        updateOctopus(grid, x, y);
      }
    }

    for (let y = 0; y < grid.length; y += 1) {
      for (let x = 0; x < grid[y].length; x += 1) {
        if (grid[y][x] < 0) {
          numberOfFlashesThisRound += 1;
          // eslint-disable-next-line no-param-reassign
          grid[y][x] = 0;
        }
      }
    }

    if (numberOfFlashesThisRound === grid.length * grid[0].length) {
      return i;
    }

    numberOfFlashes += numberOfFlashesThisRound;
    // console.log("------");
    // console.log(grid.map((s) => s.join("")).join("\n"));
    // console.log("------");
  }

  return numberOfFlashes;
};

const solve2 = (depths: number[][]): number => 1;

const parse = (lines: string[]): number[][] =>
  lines.map((s) => s.split("").map((char) => parseInt(char, 10)));

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day11: Day<
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

export default day11;
