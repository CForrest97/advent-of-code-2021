import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

class Polymer {
  private polymer: Map<string, number> = new Map();

  public addPair(pair: string, count: number) {
    const currentCount = this.polymer.get(pair) ?? 0;
    this.polymer.set(pair, currentCount + count);
  }

  public getPairs(): string[] {
    return [...this.polymer.keys()];
  }

  public getCount(pair: string): number {
    return this.polymer.get(pair);
  }

  public getCounts(): number[] {
    return [...this.polymer.values()];
  }

  public toString(): any {
    return this.polymer;
  }
}

class PolymerExtender {
  private polymer: Polymer;

  private lastChar: string;

  constructor(polymer: string[], private pairInsertions: Map<string, string>) {
    this.polymer = new Polymer();
    this.lastChar = polymer[polymer.length - 1];
    polymer.slice(0, -1).forEach((char, i) => {
      const pair = `${char}${polymer[i + 1]}`;
      this.polymer.addPair(pair, 1);
    });
  }

  public extendPolymer() {
    const nextPolymer = new Polymer();
    this.polymer.getPairs().forEach((pair) => {
      const [firstChar, lastChar] = pair.split("");
      const insertedChar = this.pairInsertions.get(pair);
      const count = this.polymer.getCount(pair);
      nextPolymer.addPair(`${firstChar}${insertedChar}`, count);
      nextPolymer.addPair(`${insertedChar}${lastChar}`, count);
    });

    this.polymer = nextPolymer;
    // console.log(this.polymer.toString());
  }

  public getScore() {
    const charCount: Map<string, number> = new Map([[this.lastChar, 1]]);

    this.polymer.getPairs().forEach((pair) => {
      const [firstChar] = pair.split("");
      const currentFirstCharCount = charCount.get(firstChar) ?? 0;
      // const currentLastCharCount = charCount.get(lastChar) ?? 0;
      const pairCount = this.polymer.getCount(pair);
      charCount.set(firstChar, currentFirstCharCount + pairCount);
      // charCount.set(lastChar, currentLastCharCount + pairCount);
    });
    console.log(charCount);
    const max = Math.max(...charCount.values());
    const min = Math.min(...charCount.values());

    return max - min;
  }
}

type LinkedNode = {
  v: string;
  n: number | null;
};

class LinkedList {
  private polymer: LinkedNode[] = [];

  constructor(polymer: string[], private pairInsertions: Map<string, string>) {
    polymer.forEach((char, i) => {
      this.polymer.push({
        v: char,
        n: i < polymer.length - 1 ? i + 1 : null,
      });
    });
  }

  public updatePolymer() {
    // console.log(this.polymer);
    let poly = this.polymer[0];
    let currentIndex = 0;

    while (poly.n !== null) {
      const firstChar = poly.v;
      const { n } = poly;
      const secondPoly = this.polymer[n];
      this.polymer[currentIndex].n = this.polymer.length;
      this.polymer.push({
        n: n,
        v: this.pairInsertions.get(`${firstChar}${secondPoly.v}`),
      });
      // console.log(this.polymer, nextIndex);

      currentIndex = n;
      poly = this.polymer[n];
    }

    console.log(this.polymer.length);
  }

  public toString() {
    let s = "";
    let poly = this.polymer[0];
    s += poly.v;

    while (poly.n !== null) {
      const { n } = poly;

      poly = this.polymer[n];
      s += poly.v;
    }

    return s;
  }

  public getScore() {
    const countedCharacters = new Map<string, number>();

    this.polymer.forEach((poly) => {
      const currentCount = countedCharacters.get(poly.v) ?? 0;
      countedCharacters.set(poly.v, currentCount + 1);
    });

    const max = Math.max(...countedCharacters.values());
    const min = Math.min(...countedCharacters.values());

    return max - min;
  }
}

const solve1 = ([polymerTemplate, pairInsertions]: [
  string[],
  Map<string, string>
]): number => {
  // const l = new LinkedList(polymerTemplate, pairInsertions);
  const polymerExtender = new PolymerExtender(polymerTemplate, pairInsertions);
  for (let i = 0; i < 40; i++) {
    polymerExtender.extendPolymer();
  }

  return polymerExtender.getScore();
};

const solve2 = ([polymerTemplate, pairInsertions]: [
  string[],
  Map<string, string>
]): number => 1;

const parse = (lines: string[]): [string[], Map<string, string>] => {
  const pairInsertions = new Map<string, string>();
  const [template, , ...pairInsertionLines] = lines;

  pairInsertionLines.forEach((line) => {
    const [pair, inserter] = line.split(" -> ");
    pairInsertions.set(pair, inserter);
  });

  return [template.split(""), pairInsertions];
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
