import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

const getCorruptedCharacter = (line: string[]): string | null => {
  const arr = [];
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if ("([{<".includes(char)) {
      arr.push(char);
    } else {
      const lastChar = arr[arr.length - 1];
      if (char === ")") {
        if (lastChar === "(") {
          arr.pop();
        } else {
          return char;
        }
      } else if (char === "]") {
        if (lastChar === "[") {
          arr.pop();
        } else {
          return char;
        }
      } else if (char === "}") {
        if (lastChar === "{") {
          arr.pop();
        } else {
          return char;
        }
      } else if (char === ">") {
        if (lastChar === "<") {
          arr.pop();
        } else {
          return char;
        }
      }
    }
  }

  return null;
};

const solve1 = (lines: string[][]): number => {
  const badChars = lines.map((line) => getCorruptedCharacter(line));

  return badChars
    .map((char) => {
      switch (char) {
        case ")":
          return 3;
        case "]":
          return 57;
        case "}":
          return 1197;
        case ">":
          return 25137;
        default:
          return 0;
      }
    })
    .reduce((sub, x) => sub + x, 0);
};

const getRequiredChars = (line: string[]): string[] => {
  const arr = [];
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if ("([{<".includes(char)) {
      arr.push(char);
    } else {
      const lastChar = arr[arr.length - 1];
      if (char === ")") {
        if (lastChar === "(") {
          arr.pop();
        }
      } else if (char === "]") {
        if (lastChar === "[") {
          arr.pop();
        }
      } else if (char === "}") {
        if (lastChar === "{") {
          arr.pop();
        }
      } else if (char === ">") {
        if (lastChar === "<") {
          arr.pop();
        }
      }
    }
  }

  return arr
    .map((char) => {
      if (char === "(") return ")";
      if (char === "{") return "}";
      if (char === "[") return "]";
      return ">";
    })
    .reverse();
};

const solve2 = (lines: string[][]): number => {
  const unfinishedLines = lines.filter(
    (line) => getCorruptedCharacter(line) === null
  );

  const requiredLines = unfinishedLines.map((line) => getRequiredChars(line));
  console.log(requiredLines);
  const scores = requiredLines.map((line) =>
    line.reduce((score, char) => {
      let s = 0;
      if (char === ")") {
        s = 1;
      }
      if (char === "]") {
        s = 2;
      }
      if (char === "}") {
        s = 3;
      }
      if (char === ">") {
        s = 4;
      }
      return score * 5 + s;
    }, 0)
  );

  scores.sort((a, b) => a - b);
  console.log(scores);
  return scores[(scores.length - 1) / 2];
};

const parse = (lines: string[]): string[][] =>
  lines.map((line) => line.split(""));

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day10: Day<
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

export default day10;
