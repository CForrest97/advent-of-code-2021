import assert from "assert";
import { readLines } from "../helpers/readLines";
import { Day } from "../runner";
import day2 from "../002";

type Point = { x: number; y: number };

class VentRepository {
  private ventedAreas: Map<string, number> = new Map();

  constructor(lines: [Point, Point][]) {
    lines.forEach(([p1, p2]) => {
      if (p1.x === p2.x) {
        this.addVerticalLine(p1, p2);
      } else if (p1.y === p2.y) {
        this.addHorizontalLine(p1, p2);
      } else {
        this.addDiagonalLine(p1, p2);
      }
    });
  }

  public getNumberOfOverlappingVents(): number {
    const values = [...this.ventedAreas.values()];
    return values.filter((n) => n >= 2).length;
  }

  private addDiagonalLine(p1: Point, p2: Point): void {
    const smallest = p1.y < p2.y ? p1 : p2;
    const biggest = p1.y > p2.y ? p1 : p2;

    const deltaX = biggest.x - smallest.x > 0 ? 1 : -1;

    for (let deltaY = 0; deltaY <= biggest.y - smallest.y; deltaY += 1) {
      const s = `${smallest.x + deltaY * deltaX},${smallest.y + deltaY}`;
      const currentScore = this.ventedAreas.get(s) ?? 0;
      this.ventedAreas.set(s, currentScore + 1);
    }
  }

  private addVerticalLine(p1: Point, p2: Point): void {
    const smallest = p1.y < p2.y ? p1 : p2;
    const biggest = p1.y > p2.y ? p1 : p2;

    for (let deltaY = 0; deltaY <= biggest.y - smallest.y; deltaY += 1) {
      const s = `${smallest.x},${smallest.y + deltaY}`;
      const currentScore = this.ventedAreas.get(s) ?? 0;
      this.ventedAreas.set(s, currentScore + 1);
    }
  }

  private addHorizontalLine(p1: Point, p2: Point): void {
    const smallest = p1.x < p2.x ? p1 : p2;
    const biggest = p1.x > p2.x ? p1 : p2;

    for (let deltaX = 0; deltaX <= biggest.x - smallest.x; deltaX += 1) {
      const s = `${smallest.x + deltaX},${smallest.y}`;
      const currentScore = this.ventedAreas.get(s) ?? 0;
      this.ventedAreas.set(s, currentScore + 1);
    }
  }
}

const solve1 = (lines: [Point, Point][]): number => {
  const verticalAndHorizontalLines = lines.filter(
    ([p1, p2]) => p1.x === p2.x || p1.y === p2.y
  );

  const ventRepository = new VentRepository(verticalAndHorizontalLines);
  return ventRepository.getNumberOfOverlappingVents();
};

const solve2 = (lines: [Point, Point][]): number => {
  const ventRepository = new VentRepository(lines);

  return ventRepository.getNumberOfOverlappingVents();
};

const parse = (lines: string[]): [Point, Point][] =>
  lines.map((s) => {
    const match = s.match(/(\d+),(\d+) -> (\d+),(\d+)/);

    assert(match, `cannot parse ${s}`);

    const [, x1, y1, x2, y2] = match;

    const p1: Point = {
      x: parseInt(x1, 10),
      y: parseInt(y1, 10),
    };
    const p2: Point = {
      x: parseInt(x2, 10),
      y: parseInt(y2, 10),
    };

    return [p1, p2];
  });

const getSimpleInput = () => readLines(`${__dirname}/simple.txt`);
const getPuzzleInput = () => readLines(`${__dirname}/puzzle.txt`);

const day5: Day<
  ReturnType<typeof getPuzzleInput>,
  ReturnType<typeof parse>,
  ReturnType<typeof solve1>
> = {
  getSimpleInput,
  getPuzzleInput,
  parse,
  part1: {
    answers: { simple: 1, puzzle: 5092 },
    solve: solve1,
  },
  part2: {
    answers: { simple: 1, puzzle: 20484 },
    solve: solve2,
  },
};

export default day5;
