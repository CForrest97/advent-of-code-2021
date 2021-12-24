import assert from "assert";
import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const add = (augend: string, addend: string): string => `[${augend},${addend}]`;

const explode = (snailfishNumber: string): string => {
  let depth = 0;
  for (let i = 0; i < snailfishNumber.length; i += 1) {
    const char = snailfishNumber.charAt(i);
    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
    } else if (depth >= 5) {
      let b = true;
      for (let j = i; j < snailfishNumber.length; j++) {
        if (snailfishNumber.charAt(j) === "[") {
          b = false;
        } else if (snailfishNumber.charAt(j) === "]") {
          break;
        }
      }

      if (!b) {
        continue;
      }

      const start = snailfishNumber.slice(0, i - 1);

      const end = snailfishNumber.slice(i);
      const endOfPair = end.indexOf("]");

      const deeplyNestedPair = snailfishNumber.slice(
        i,
        start.length + endOfPair + 1
      );
      const [first, second] = deeplyNestedPair
        .split(",")
        .map((s) => parseInt(s, 10));
      // console.log(first, second);

      const addToEndOfPair = (s: string, n: number): string => {
        if (!s.includes(",")) return s;
        // console.log(s);

        const indexOfLastNumber =
          s.length -
          s
            .split("")
            .reverse()
            .findIndex((c) => !"[],".split("").includes(c)) -
          1;
        const indexOfStartOfLastNumber =
          s.length -
          s
            .split("")
            .reverse()
            .findIndex(
              (c, index) =>
                index > s.length - indexOfLastNumber - 1 &&
                "[],".split("").includes(c)
            );
        // console.log(indexOfLastNumber, s.charAt(indexOfLastNumber));
        // console.log(
        //   indexOfStartOfLastNumber,
        //   s.charAt(indexOfStartOfLastNumber)
        // );
        // console.log(s.slice(indexOfStartOfLastNumber, indexOfLastNumber + 1));

        // const indexOfStartOfNumber = Math.max(s.l)

        const number = s.slice(indexOfStartOfLastNumber, indexOfLastNumber + 1);
        const addedNumber = parseInt(number, 10) + n;
        return `${s.slice(0, indexOfStartOfLastNumber)}${addedNumber}${s.slice(
          indexOfLastNumber + 1
        )}`;
      };

      const addToStartOfPair = (s: string, n: number): string => {
        if (!s.includes(",")) return s;

        const indexOfStartOfNumber = s
          .split("")
          .findIndex((c) => !"[],".split("").includes(c));
        const indexOfEndOfNumber =
          s
            .split("")
            .findIndex(
              (c, index) =>
                index > indexOfStartOfNumber && "[],".split("").includes(c)
            ) - 1;

        const number = s.slice(indexOfStartOfNumber, indexOfEndOfNumber + 1);
        const addedNumber = parseInt(number, 10) + n;
        return `${s.slice(0, indexOfStartOfNumber)}${addedNumber}${s.slice(
          indexOfEndOfNumber + 1
        )}`;
      };

      return `${addToEndOfPair(start, first)}0${addToStartOfPair(
        end.slice(endOfPair + 1),
        second
      )}`;
    }
  }
  return snailfishNumber;
};

const split = (snailfishNumber: string): string => {
  let currentNumberString = "";
  for (let i = 0; i < snailfishNumber.length; i += 1) {
    const char = snailfishNumber.charAt(i);
    if ("[],".includes(char)) {
      if (currentNumberString.length >= 2) {
        const number = parseInt(currentNumberString, 10);
        const left = Math.floor(number / 2);
        const right = Math.ceil(number / 2);

        return `${snailfishNumber.slice(
          0,
          i - currentNumberString.length
        )}[${left},${right}]${snailfishNumber.slice(i)}`;
      }
      currentNumberString = "";
    } else {
      currentNumberString += char;
    }
  }

  return snailfishNumber;
};

const reduceNumber = (snailfishNumber: string): string => {
  // console.log(snailfishNumber);
  const exploded = explode(snailfishNumber);
  if (exploded !== snailfishNumber) {
    return reduceNumber(exploded);
  }

  // throw new Error("");

  const splitted = split(snailfishNumber);
  if (splitted !== snailfishNumber) {
    return reduceNumber(splitted);
  }

  return snailfishNumber;
};

const solveMagnitude = (snailfishNumber: string): number => {
  const match = /\[(\d+),(\d+)\]/.exec(snailfishNumber);
  assert(match, `cannot parse ${match}`);

  const [total, first, second] = match;

  const replacement = parseInt(first, 10) * 3 + parseInt(second, 10) * 2;

  if (total.length === snailfishNumber.length) {
    return replacement;
  }

  return solveMagnitude(
    `${snailfishNumber.slice(
      0,
      match.index
    )}${replacement}${snailfishNumber.slice(match.index + total.length)}`
  );
};

const solve1 = (snailfishNumbers: string[]): number => {
  const sum = snailfishNumbers.reduce((subtotal, number) =>
    reduceNumber(add(subtotal, number))
  );

  // console.log(solveMagnitude(sum));

  // console.log(solveMagnitude("[[9,1],[1,9]]"));

  // console.log(add("[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]"));
  // console.log(explode("[[[[[9,8],1],2],3],4]"));
  // console.log(explode("[[6,[5,[4,[3,2]]]],1]"));
  // console.log(explode("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]"));

  // console.log(split("[[[[0,7],4],[15,[0,13]]],[1,1]]"));
  // console.log(split("[[[[0,7],4],[[7,8],[0,13]]],[1,1]]"));

  // console.log(reduceNumber("[[[[0,7],4],[15,[0,13]]],[1,1]]"));

  // console.log(
  //   explode("[[[[4,0],[9,[[0,[7,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]")
  // );

  // console.log(
  //   "[[[[4,0],[5,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]\n"
  // );
  // console.log(
  //   explode(
  //     "[[[[4,0],[5,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]\n"
  //   )
  // );

  // console.log(
  //   explode("[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,0],[8,[[5,6],8]]]]]")
  // );
  //
  // console.log(
  //   reduceNumber(
  //     add(
  //       "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]",
  //       "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]"
  //     )
  //   )
  // );

  // console.log(explode("[[[[0,7],4],[7,[[8,4],9]]],[1,1]]"));

  // console.log(reduceNumber("[[[[0,7],4],[15,[0,13]]],[1,1]]"));
  return 1;
};

const solve2 = (snailfishNumbers: string[]): number => {
  const sums = [];

  console.log(
    solveMagnitude(
      reduceNumber(
        add(
          "[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]",
          "[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]"
        )
      )
    )
  );

  for (let i = 0; i < snailfishNumbers.length - 1; i += 1) {
    for (let j = 0; j < snailfishNumbers.length; j += 1) {
      if (i !== j) {
        sums.push(reduceNumber(add(snailfishNumbers[i], snailfishNumbers[j])));
      }
    }
  }
  const magnitudes = sums.map((s) => solveMagnitude(s));

  return Math.max(...magnitudes);
};

const parse = (lines: string[]): string[] => lines;

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
