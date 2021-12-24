import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const transpose = <T>(arr: T[][]): T[][] =>
  arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));

const solve1 = (report: number[][]): number => {
  const mostCommonNumber = transpose(report)
    .map((column) =>
      column.reduce(
        (acc, b) =>
          b === 0
            ? { zeroes: acc.zeroes + 1, ones: acc.ones }
            : { zeroes: acc.zeroes, ones: acc.ones + 1 },
        { zeroes: 0, ones: 0 }
      )
    )
    .map(({ zeroes, ones }) => (zeroes > ones ? 0 : 1));
  const least = mostCommonNumber.map((n) => (n === 0 ? 1 : 0));
  const most = parseInt(mostCommonNumber.join(""), 2);
  const l = parseInt(least.join(""), 2);

  console.log(most);
  return l * most;
};

const getMostCommonValue = (ns: (0 | 1)[]): 0 | 1 =>
  Math.round(
    ns.reduce((subtotal: number, n) => subtotal + n, 0) / ns.length
  ) as 0 | 1;

const getLeastCommonValue = (ns: (0 | 1)[]): 0 | 1 =>
  (1 - getMostCommonValue(ns)) as 1 | 0;

const getLastRemainingReport =
  (getBit: (ns: (0 | 1)[]) => 0 | 1) =>
  (reports: (0 | 1)[][]): (0 | 1)[] => {
    let remainingReports = reports.map((report) => ({
      original: report,
      reduced: report,
    }));

    while (remainingReports.length > 1) {
      const bit = getBit(remainingReports.map((report) => report.reduced[0]));

      remainingReports = remainingReports
        .filter((report) => report.reduced[0] === bit)
        .map((report) => ({
          original: report.original,
          reduced: report.reduced.slice(1),
        }));
    }

    return remainingReports[0].original;
  };

const solve2 = (reports: (0 | 1)[][]): number => {
  const filteredReports1 = reports.map((report) => ({
    original: report,
    reduced: report,
  }));

  const max = getLastRemainingReport(getMostCommonValue)(reports);
  const min = getLastRemainingReport(getLeastCommonValue)(reports);

  return parseInt(max.join(""), 2) * parseInt(min.join(""), 2);
};

const parse = (lines: string[]): (0 | 1)[][] =>
  lines.map((b) => b.split("").map((n) => parseInt(n, 2) as 0 | 1));

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day3: Day<
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

export default day3;
