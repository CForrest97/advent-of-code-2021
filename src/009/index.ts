import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type HeightMap = Map<string, number | undefined>;

const solve1 = (heightMap: HeightMap): number => {
  const minPoints = [...heightMap.entries()].filter(([position, height]) => {
    const [x, y] = position.split(",").map((s) => parseInt(s, 10));
    if ((heightMap.get([x - 1, y].toString()) ?? Infinity) <= height)
      return false;
    if ((heightMap.get([x + 1, y].toString()) ?? Infinity) <= height)
      return false;
    if ((heightMap.get([x, y - 1].toString()) ?? Infinity) <= height)
      return false;
    if ((heightMap.get([x, y + 1].toString()) ?? Infinity) <= height)
      return false;
    return true;
  });

  return minPoints
    .map(([, height]) => height + 1)
    .reduce((subtotal, height) => subtotal + height);
};

const solve2 = (heightMap: HeightMap): number => {
  const basins: Set<string>[] = [];

  const minPoints = [...heightMap.entries()].filter(([position, height]) => {
    const [x, y] = position.split(",").map((s) => parseInt(s, 10));
    if ((heightMap.get([x - 1, y].toString()) ?? Infinity) <= height)
      return false;
    if ((heightMap.get([x + 1, y].toString()) ?? Infinity) <= height)
      return false;
    if ((heightMap.get([x, y - 1].toString()) ?? Infinity) <= height)
      return false;
    if ((heightMap.get([x, y + 1].toString()) ?? Infinity) <= height)
      return false;
    return true;
  });

  minPoints.forEach(([position]) => {
    const s = new Set<string>();
    s.add(position);
    basins.push(s);
  });

  console.log(basins[0]);

  let basinSizes = -1;
  let previousSize = 0;
  while (previousSize !== basinSizes) {
    previousSize = basinSizes;
    basins.forEach((basin) => {
      [...basin.values()].forEach((position) => {
        const [x, y] = position.split(",").map((s) => parseInt(s, 10));
        if ((heightMap.get([x - 1, y].toString()) ?? 9) !== 9)
          basin.add([x - 1, y].toString());
        if ((heightMap.get([x + 1, y].toString()) ?? 9) !== 9)
          basin.add([x + 1, y].toString());
        if ((heightMap.get([x, y - 1].toString()) ?? 9) !== 9)
          basin.add([x, y - 1].toString());
        if ((heightMap.get([x, y + 1].toString()) ?? 9) !== 9)
          basin.add([x, y + 1].toString());
      });
    });

    console.log(basins);

    basinSizes = basins
      .map((basin) => basin.size)
      .reduce((subtotal, x) => subtotal + x);
  }

  const sizes = basins.map((basin) => basin.size);
  console.log(sizes);
  sizes.sort((a, b) => b - a);
  console.log(sizes);
  console.log(sizes[0] * sizes[1] * sizes[2]);
  return 8;
};

const parse = (lines: string[]): HeightMap => {
  const heightMap: HeightMap = new Map();
  lines.map((s, y) =>
    s
      .split("")
      .map((height) => parseInt(height, 10))
      .forEach((h, x) => {
        heightMap.set([x, y].toString(), h);
      })
  );

  return heightMap;
};

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day9: Day<
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

export default day9;
