import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const solve1 = ([seaCreaturesRight, seaCreaturesDown]: [
  Set<string>,
  Set<string>
]): number => {
  let updatedSeaCreaturesRight = new Set(seaCreaturesRight);
  let updatedSeaCreaturesDown = new Set(seaCreaturesDown);

  for (let i = 0; i < 10000; i += 1) {
    const nextSeaCreaturesRight = new Set<string>();
    const nextSeaCreaturesDown = new Set<string>();
    let hasAnyMoved = false;

    [...updatedSeaCreaturesRight].forEach((seaCreature) => {
      const [x, y] = seaCreature.split(",").map((s) => parseInt(s, 10));

      if (
        !updatedSeaCreaturesRight.has(`${(x + 1) % 139},${y}`) &&
        !updatedSeaCreaturesDown.has(`${(x + 1) % 139},${y}`)
      ) {
        hasAnyMoved = true;
        nextSeaCreaturesRight.add(`${(x + 1) % 139},${y}`);
      } else {
        nextSeaCreaturesRight.add(`${x},${y}`);
      }
    });
    updatedSeaCreaturesRight = nextSeaCreaturesRight;

    [...updatedSeaCreaturesDown.values()].forEach((seaCreature) => {
      const [x, y] = seaCreature.split(",").map((s) => parseInt(s, 10));

      if (
        !updatedSeaCreaturesRight.has(`${x},${(y + 1) % 137}`) &&
        !updatedSeaCreaturesDown.has(`${x},${(y + 1) % 137}`)
      ) {
        hasAnyMoved = true;
        nextSeaCreaturesDown.add(`${x},${(y + 1) % 137}`);
      } else {
        nextSeaCreaturesDown.add(`${x},${y}`);
      }
    });

    if (!hasAnyMoved) {
      return i + 1;
    }

    updatedSeaCreaturesDown = nextSeaCreaturesDown;
  }

  return -1;
};

const solve2 = (): number => 1;

const parse = (lines: string[]): [Set<string>, Set<string>] => {
  const seaCreaturesRight = new Set<string>();
  const seaCreaturesDown = new Set<string>();

  lines.forEach((s, y) => {
    s.split("").forEach((char, x) => {
      if (char === ">") {
        seaCreaturesRight.add(`${x},${y}`);
      }
      if (char === "v") {
        seaCreaturesDown.add(`${x},${y}`);
      }
    });
  });

  return [seaCreaturesRight, seaCreaturesDown];
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
