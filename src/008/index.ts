import assert from "assert";
import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const solve1 = (entries: [string[], string[]][]): number =>
  entries
    .map(
      ([, outputValues]) =>
        outputValues.filter((s) => [2, 3, 4, 7].includes(s.length)).length
    )
    .reduce((subtotal, n) => subtotal + n);

const sort = (str: string) =>
  str
    .split("")
    .sort((a, b) => a.localeCompare(b))
    .join("");

const getMappings = (signalPatterns: string[]) => {
  const one = signalPatterns.find(
    (signalPattern) => signalPattern.length === 2
  );
  const seven = signalPatterns.find(
    (signalPattern) => signalPattern.length === 3
  );
  const four = signalPatterns.find(
    (signalPattern) => signalPattern.length === 4
  );
  const eight = signalPatterns.find(
    (signalPattern) => signalPattern.length === 7
  );
  const pattensWithLengthSix = signalPatterns.filter(
    (signalPattern) => signalPattern.length === 6
  );
  const six = pattensWithLengthSix.find(
    (pattern) =>
      !pattern.includes(one.charAt(0)) || !pattern.includes(one.charAt(1))
  );
  const nine = pattensWithLengthSix.find((pattern) =>
    four.split("").every((c) => pattern.includes(c))
  );
  const zero = pattensWithLengthSix.find(
    (pattern) => pattern !== six && pattern !== nine
  );

  const a = seven.split("").find((s) => !one.includes(s));
  const c = "abcdefg".split("").find((s) => !six.includes(s));
  const d = "abcdefg".split("").find((s) => !zero.includes(s));
  const e = "abcdefg".split("").find((s) => !nine.includes(s));
  const f = one.split("").find((s) => s !== c);
  const b = four.split("").find((s) => ![c, d, f].includes(s));
  const g = "abcdefg".split("").find((s) => ![a, b, c, d, e, f].includes(s));

  const two = `${a}${c}${d}${e}${g}`;
  const three = `${a}${c}${d}${f}${g}`;
  const five = `${a}${b}${d}${f}${g}`;

  return {
    zero: sort(zero),
    one: sort(one),
    two: sort(two),
    three: sort(three),
    four: sort(four),
    five: sort(five),
    six: sort(six),
    seven: sort(seven),
    eight: sort(eight),
    nine: sort(nine),
  };
};

const getValueFromMappings = (
  s: string,
  mappings: ReturnType<typeof getMappings>
): number => Object.values(mappings).findIndex((value) => value === s);

const solve2 = (entries: [string[], string[]][]): number =>
  entries
    .map(([signalPatterns, outputValues]): number => {
      const mappings = getMappings(signalPatterns);
      console.log(mappings);

      return parseInt(
        outputValues
          .map((v) => getValueFromMappings(sort(v), mappings))
          .join(""),
        10
      );
    })
    .reduce((subtotal, x) => subtotal + x);

const parse = (lines: string[]): [string[], string[]][] =>
  lines.map((line) => {
    const match = line.match(/^(.*) \| (.*)$/);
    assert(match, `cannot parse line: ${line}`);

    const [, signalPatterns, outputValues] = match;
    console.log(line);
    console.log(signalPatterns);
    console.log(outputValues);

    return [signalPatterns.split(" "), outputValues.split(" ")];
  });

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day8: Day<
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

export default day8;
