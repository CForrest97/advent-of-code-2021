import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

// Patterns noticed from "good" results
// index: 5 is 5 more than index: 4
// index: 2 is 1 more than index: 3
// index: 11 is 6 more than index: 12
// index: 13 is 2 more than index: 10
// index: 7 is 8 more than index: 6
// index: 8 is 4 more than index: 1
// index: 9 is 3 more than index: 0

type MemoryPosition = "w" | "x" | "y" | "z";

class ALU {
  private memory: Map<MemoryPosition, number> = new Map([
    ["w", 0],
    ["x", 0],
    ["y", 0],
    ["z", 0],
  ]);

  input(a: MemoryPosition, value: number) {
    this.memory.set(a, value);
  }

  add(a: MemoryPosition, b: MemoryPosition | number) {
    const valueOfB = typeof b === "number" ? b : this.memory.get(b);
    this.memory.set(a, this.memory.get(a) + valueOfB);
  }

  multiply(a: MemoryPosition, b: MemoryPosition | number) {
    const valueOfB = typeof b === "number" ? b : this.memory.get(b);
    this.memory.set(a, this.memory.get(a) * valueOfB);
  }

  divide(a: MemoryPosition, b: MemoryPosition | number) {
    const valueOfB = typeof b === "number" ? b : this.memory.get(b);
    this.memory.set(a, Math.floor(this.memory.get(a) / valueOfB));
  }

  modulo(a: MemoryPosition, b: MemoryPosition | number) {
    const valueOfB = typeof b === "number" ? b : this.memory.get(b);
    this.memory.set(a, this.memory.get(a) % valueOfB);
  }

  compare(a: MemoryPosition, b: MemoryPosition | number) {
    const valueOfB = typeof b === "number" ? b : this.memory.get(b);
    this.memory.set(a, this.memory.get(a) === valueOfB ? 1 : 0);
  }

  public getW() {
    return this.memory.get("w");
  }

  public getX() {
    return this.memory.get("x");
  }

  public getY() {
    return this.memory.get("y");
  }

  public getZ() {
    return this.memory.get("z");
  }
}

type Instruction = "inp" | "add" | "mul" | "div" | "mod" | "eql";

type Command = [Instruction, MemoryPosition, MemoryPosition | number | null];

const compute = (monad: number[], commands: Command[]): number => {
  const alu = new ALU();
  let index = 0;

  for (let i = 0; i < commands.length; i += 1) {
    const [instruction, a, b] = commands[i];
    // eslint-disable-next-line default-case
    switch (instruction) {
      case "inp":
        alu.input(a, monad[index]);
        index += 1;
        break;
      case "add":
        alu.add(a, b);
        break;
      case "mul":
        alu.multiply(a, b);
        break;
      case "div":
        alu.divide(a, b);
        break;
      case "mod":
        alu.modulo(a, b);
        break;
      case "eql":
        alu.compare(a, b);
        break;
    }
  }

  return alu.getZ();
};

const solve1 = (commands: Command[]): number => {
  for (let i = 11111111111111; i < 99999999999999; i += 1) {
    const monad = i
      .toString()
      .split("")
      .map((s) => parseInt(s, 10));

    if (monad.some((n) => n === 0)) continue;

    if (Math.abs(monad[5] - monad[4]) !== 5) {
      i += 100000000 - 1;
      continue;
    }
    if (Math.abs(monad[2] - monad[3]) !== 1) {
      i += 10000000000 - 1;
      continue;
    }
    if (Math.abs(monad[11] - monad[12]) !== 6) {
      i += 10 - 1;
      continue;
    }
    if (Math.abs(monad[13] - monad[10]) !== 2) {
      i += 1 - 1;
      continue;
    }
    if (Math.abs(monad[7] - monad[6]) !== 8) {
      i += 1000000 - 1;
      continue;
    }
    if (Math.abs(monad[8] - monad[1]) !== 4) {
      i += 100000 - 1;
      continue;
    }
    if (Math.abs(monad[9] - monad[0]) !== 3) {
      i += 10000 - 1;
      continue;
    }

    const value = compute(monad, commands);

    if (value === 0) {
      return i;
    }
  }

  throw new Error("No value found (should not happen)");
};

const solve2 = (commands: Command[]): number => 1;

const parse = (lines: string[]): Command[] =>
  lines.map((line) => {
    const [instruction, first, second] = line.split(" ");

    if (second) {
      const n = parseInt(second, 10);
      if (!Number.isNaN(n)) {
        return [instruction as Instruction, first as MemoryPosition, n];
      }
      return [
        instruction as Instruction,
        first as MemoryPosition,
        second as MemoryPosition,
      ];
    }

    return [instruction as Instruction, first as MemoryPosition, null];
  });

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day24: Day<
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

export default day24;
