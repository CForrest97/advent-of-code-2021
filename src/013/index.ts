import assert from "assert";
import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Point = [number, number];
type Fold = { x: number } | { y: number };

const solve1 = ([points, folds]: [Point[], Fold[]]): number => {
  let newPoints = [...points];

  folds.forEach((fold) => {
    console.log(fold);
    if ("x" in fold) {
      newPoints = newPoints.map(([x, y]) => [fold.x - Math.abs(fold.x - x), y]);
    } else {
      newPoints = newPoints.map(([x, y]) => [x, fold.y - Math.abs(fold.y - y)]);
    }
  });

  const maxX = Math.max(...newPoints.map(([x]) => x));
  const minX = Math.min(...newPoints.map(([x]) => x));
  const maxY = Math.max(...newPoints.map(([, y]) => y));
  const minY = Math.min(...newPoints.map(([, y]) => y));

  const arr = Array.from({ length: maxY + 10 }, () =>
    Array.from({ length: maxX + 10 }).map(() => " ")
  );

  newPoints.forEach(([x, y]) => (arr[y][x] = "#"));

  console.log(arr.map((s) => s.join("")).join("\n"));

  const set = new Set();
  newPoints.forEach(([x, y]) => {
    set.add(`${x},${y}`);
  });

  return set.size;
};

const solve2 = ([points, folds]: [Point[], Fold[]]): number => 1;

const parse = (lines: string[]): [Point[], Fold[]] => {
  const points: Point[] = [];
  const folds: Fold[] = [];

  let isPoint = true;

  lines.forEach((line) => {
    if (line === "") {
      isPoint = false;
    } else if (isPoint) {
      const [x, y] = line.split(",");
      points.push([parseInt(x, 10), parseInt(y, 10)]);
    } else {
      const match = line.match(/fold along (.)=(\d+)/);
      assert(match, `cannot parse ${line}`);
      const [, char, number] = match;
      folds.push({
        [char as "x" | "y"]: parseInt(number, 10),
      } as any);
    }
  });

  return [points, folds];
};

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day13: Day<
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

export default day13;
