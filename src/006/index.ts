import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const advanceAges = (population: FishPopulation): FishPopulation => ({
  "0": population["1"],
  "1": population["2"],
  "2": population["3"],
  "3": population["4"],
  "4": population["5"],
  "5": population["6"],
  "6": population["7"] + population["0"],
  "7": population["8"],
  "8": population["0"],
});

const solve1 = (population: FishPopulation): number => {
  let updatedAges = population;
  for (let i = 0; i < 80; i += 1) {
    updatedAges = advanceAges(updatedAges);
  }
  console.log(updatedAges);
  return (
    updatedAges["0"] +
    updatedAges["1"] +
    updatedAges["2"] +
    updatedAges["3"] +
    updatedAges["4"] +
    updatedAges["5"] +
    updatedAges["6"] +
    updatedAges["7"] +
    updatedAges["8"]
  );
};

const solve2 = (population: FishPopulation): number => {
  let updatedAges = population;
  for (let i = 0; i < 256; i += 1) {
    updatedAges = advanceAges(updatedAges);
  }
  return (
    updatedAges["0"] +
    updatedAges["1"] +
    updatedAges["2"] +
    updatedAges["3"] +
    updatedAges["4"] +
    updatedAges["5"] +
    updatedAges["6"] +
    updatedAges["7"] +
    updatedAges["8"]
  );
};

type FishPopulation = {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
};

const parse = ([line]: [string]): FishPopulation => {
  const ages = line.split(",").map((s) => parseInt(s, 10));
  const population: FishPopulation = {
    0: ages.filter((age) => age === 0).length,
    1: ages.filter((age) => age === 1).length,
    2: ages.filter((age) => age === 2).length,
    3: ages.filter((age) => age === 3).length,
    4: ages.filter((age) => age === 4).length,
    5: ages.filter((age) => age === 5).length,
    6: ages.filter((age) => age === 6).length,
    7: ages.filter((age) => age === 7).length,
    8: ages.filter((age) => age === 8).length,
  };

  return population;
};

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day6: Day<
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

export default day6;
