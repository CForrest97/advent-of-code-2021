import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Path = {
  journey: [number, number][];
  riskLevel: number;
  visitedNodes: Set<string>;
};

class PathSolver {
  private minimumJourneyRiskValue: number[][];

  private visitedNodes = new Set<string>().add("0,0");

  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private individualRiskLevels: number[][]) {
    this.minimumJourneyRiskValue = individualRiskLevels.map((row) =>
      row.map((r) => Infinity)
    );

    this.minimumJourneyRiskValue[0][0] = 0;
  }

  public hasFoundEnd() {
    return this.visitedNodes.has(
      `${this.minimumJourneyRiskValue.length - 1},${
        this.minimumJourneyRiskValue[0].length - 1
      }`
    );
  }

  public getMinimumJourneyRiskToEnd() {
    return this.minimumJourneyRiskValue[
      this.minimumJourneyRiskValue.length - 1
    ][this.minimumJourneyRiskValue[0].length - 1];
  }

  public visitNextNodes() {
    console.log(this.visitedNodes.size);

    [...this.visitedNodes.values()].forEach((value) => {
      const [x, y] = value.split(",").map((s) => parseInt(s, 10));
      const riskValueForJourney = this.minimumJourneyRiskValue[y][x];
      if (x > 0) {
        this.minimumJourneyRiskValue[y][x - 1] = Math.min(
          this.minimumJourneyRiskValue[y][x - 1],
          riskValueForJourney + this.individualRiskLevels[y][x - 1]
        );

        this.visitedNodes.add(`${x - 1},${y}`);
      }
      if (x < this.minimumJourneyRiskValue[y].length - 1) {
        this.minimumJourneyRiskValue[y][x + 1] = Math.min(
          this.minimumJourneyRiskValue[y][x + 1],
          riskValueForJourney + this.individualRiskLevels[y][x + 1]
        );

        this.visitedNodes.add(`${x + 1},${y}`);
      }
      if (y > 0) {
        this.minimumJourneyRiskValue[y - 1][x] = Math.min(
          this.minimumJourneyRiskValue[y - 1][x],
          riskValueForJourney + this.individualRiskLevels[y - 1][x]
        );

        this.visitedNodes.add(`${x},${y - 1}`);
      }
      if (y < this.minimumJourneyRiskValue.length - 1) {
        this.minimumJourneyRiskValue[y + 1][x] = Math.min(
          this.minimumJourneyRiskValue[y + 1][x],
          riskValueForJourney + this.individualRiskLevels[y + 1][x]
        );

        this.visitedNodes.add(`${x},${y + 1}`);
      }
    });

    // console.log(
    //   this.minimumJourneyRiskValue
    //     .map((row) => row.map((c) => (c === Infinity ? "*" : c)).join(""))
    //     .join("\n")
    // );
  }
}

const solve1 = (riskMap: number[][]): number => {
  const pathSolver = new PathSolver(riskMap);
  while (!pathSolver.hasFoundEnd()) {
    pathSolver.visitNextNodes();
  }

  return pathSolver.getMinimumJourneyRiskToEnd();
};

const incrementRow = (row: number[]): number[] =>
  row.map((v) => (v === 9 ? 1 : v + 1));

const solve2 = (riskMap: number[][]): number => {
  const wideMap = riskMap.map((row) => [
    ...row,
    ...incrementRow(row),
    ...incrementRow(incrementRow(row)),
    ...incrementRow(incrementRow(incrementRow(row))),
    ...incrementRow(incrementRow(incrementRow(incrementRow(row)))),
  ]);

  let largeMap = wideMap;

  for (let i = 0; i < 5 - 1; i += 1) {
    const newRows = wideMap.map((row) => {
      let updatedRow = row;

      for (let j = 0; j < i + 1; j += 1) {
        updatedRow = incrementRow(updatedRow);
      }

      return updatedRow;
    });

    largeMap = [...largeMap, ...newRows];
  }

  const pathSolver = new PathSolver(largeMap);
  console.log(largeMap.length);
  // console.log(largeMap.map((row) => row.join("")).join("\n"));
  while (!pathSolver.hasFoundEnd()) {
    pathSolver.visitNextNodes();
  }

  return pathSolver.getMinimumJourneyRiskToEnd();
};

const parse = (lines: string[]): number[][] =>
  lines.map((s) => s.split("").map((n) => parseInt(n, 10)));

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
