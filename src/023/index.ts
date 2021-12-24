import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Position = {
  x: number;
  y: number;
};

type AmphipodSpecies = "amber" | "bronze" | "copper" | "desert";

type Room = { position: Position; id: AmphipodSpecies };

const rooms: Room[] = [
  { position: { x: 3, y: 2 }, id: "amber" },
  { position: { x: 3, y: 3 }, id: "amber" },
  { position: { x: 3, y: 4 }, id: "amber" },
  { position: { x: 3, y: 5 }, id: "amber" },
  { position: { x: 5, y: 2 }, id: "bronze" },
  { position: { x: 5, y: 3 }, id: "bronze" },
  { position: { x: 5, y: 4 }, id: "bronze" },
  { position: { x: 5, y: 5 }, id: "bronze" },
  { position: { x: 7, y: 2 }, id: "copper" },
  { position: { x: 7, y: 3 }, id: "copper" },
  { position: { x: 7, y: 4 }, id: "copper" },
  { position: { x: 7, y: 5 }, id: "copper" },
  { position: { x: 9, y: 2 }, id: "desert" },
  { position: { x: 9, y: 3 }, id: "desert" },
  { position: { x: 9, y: 4 }, id: "desert" },
  { position: { x: 9, y: 5 }, id: "desert" },
];

class Amphipod {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private position: Position,
    private species: AmphipodSpecies,
    private movedSteps: number,
    private id: number // eslint-disable-next-line no-empty-function
  ) {}

  getId() {
    return this.id;
  }

  getPosition() {
    return this.position;
  }

  isInCorridor() {
    return !this.isInRoom();
  }

  isInRoom() {
    return [3, 5, 7, 9].includes(this.getPosition().x);
  }

  isInCorrectRoom(): boolean {
    switch (this.species) {
      case "amber":
        return this.position.x === 3;
      case "bronze":
        return this.position.x === 5;
      case "copper":
        return this.position.x === 7;
      case "desert":
        return this.position.x === 9;
      default:
        return false;
    }
  }

  public getSteps() {
    return this.movedSteps;
  }

  public getSpecies() {
    return this.species;
  }
}
const visitedStates = new Map<string, number>();
const openSpaces = new Set([
  "1,1",
  "2,1",
  "3,1",
  "4,1",
  "5,1",
  "6,1",
  "7,1",
  "8,1",
  "9,1",
  "10,1",
  "11,1",
  "3,2",
  "3,3",
  "3,4",
  "3,5",
  "5,2",
  "5,3",
  "5,4",
  "5,5",
  "7,2",
  "7,3",
  "7,4",
  "7,5",
  "9,2",
  "9,3",
  "9,4",
  "9,5",
]);
let count = 0;
let bestScore = Infinity;
class AmphipodNavigator {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private amphipods: Amphipod[]) {}

  public getAmphipodNextPositions(amphipod: Amphipod): Amphipod[] {
    if (amphipod.getSteps() > 0 && amphipod.isInCorrectRoom()) return [];
    if (
      this.amphipods
        .filter((a) => a.getSpecies() === amphipod.getSpecies())
        .every((a) => a.isInCorrectRoom())
    )
      return [];

    const nextAmphipods: Amphipod[] = [amphipod];

    let previousNumber = -Infinity;

    while (previousNumber !== nextAmphipods.length) {
      previousNumber = nextAmphipods.length;
      nextAmphipods.forEach((nextAmphipod) => {
        const positions = [
          [nextAmphipod.getPosition().x - 1, nextAmphipod.getPosition().y],
          [nextAmphipod.getPosition().x + 1, nextAmphipod.getPosition().y],
          [nextAmphipod.getPosition().x, nextAmphipod.getPosition().y - 1],
          [nextAmphipod.getPosition().x, nextAmphipod.getPosition().y + 1],
        ]
          .filter(([x, y]) => openSpaces.has(`${x},${y}`))
          .filter(
            ([x, y]) =>
              !this.amphipods.some(
                (a) => a.getPosition().x === x && a.getPosition().y === y
              )
          )
          .filter(
            ([x, y]) =>
              !nextAmphipods.some(
                (a) => a.getPosition().x === x && a.getPosition().y === y
              )
          );

        positions.forEach(([x, y]) => {
          nextAmphipods.push(
            new Amphipod(
              { x, y },
              amphipod.getSpecies(),
              nextAmphipod.getSteps() + 1,
              amphipod.getId()
            )
          );
        });
      });
    }

    if (amphipod.isInCorridor()) {
      const inRoomAmphipods = nextAmphipods.filter((a) => a.isInCorrectRoom());

      inRoomAmphipods.sort((x, y) => y.getPosition().y - x.getPosition().y);

      if (inRoomAmphipods.length === 0) return [];
      const lowestAmphipod = inRoomAmphipods[0];
      if (
        this.amphipods.some(
          (a) =>
            a.getPosition().x === lowestAmphipod.getPosition().x &&
            a.getSpecies() !== lowestAmphipod.getSpecies()
        )
      ) {
        return [];
      }
      return [lowestAmphipod];
    }

    return nextAmphipods
      .filter((a) => a.isInCorridor())
      .filter((a) => ![3, 5, 7, 9].includes(a.getPosition().x));
  }

  public getEnergy() {
    return this.amphipods
      .map((a) => {
        let multiplier: number;

        switch (a.getSpecies()) {
          case "amber":
            multiplier = 1;
            break;
          case "bronze":
            multiplier = 10;
            break;
          case "copper":
            multiplier = 100;
            break;
          case "desert":
            multiplier = 1000;
            break;
        }

        return a.getSteps() * multiplier;
      })
      .reduce((sub, x) => sub + x);
  }

  public toString() {
    return [...this.amphipods]
      .sort((a, b) => a.getId() - b.getId())
      .map((a) => `(${a.getPosition().x},${a.getPosition().y},${a.getId()})`)
      .join(",");
  }

  public getMinimumEnergyToOrganise(): number {
    // console.log(visitedStates);
    count += 1;
    const energy = this.getEnergy();

    if (this.amphipods.every((amphipod) => amphipod.isInCorrectRoom())) {
      if (bestScore > energy) console.log(energy);
      bestScore = Math.min(bestScore, energy);
      return energy;
    }

    const key = this.toString();

    if (energy >= (visitedStates.get(key) ?? Infinity)) {
      return Infinity;
    }

    visitedStates.set(key, energy);

    const navigators = this.amphipods
      .flatMap((amphipod, i) => {
        const nextPositions = this.getAmphipodNextPositions(amphipod);
        // console.log(amphipod, nextPositions);
        return nextPositions.map((a) => [
          ...this.amphipods.slice(0, i),
          a,
          ...this.amphipods.slice(i + 1),
        ]);
      })
      .filter((as) => new AmphipodNavigator(as).getEnergy() < bestScore)
      .map((as) => new AmphipodNavigator(as));

    navigators.sort((a, b) => a.getEnergy() - b.getEnergy());

    if (navigators.length === 0) return Infinity;

    return Math.min(...navigators.map((n) => n.getMinimumEnergyToOrganise()));
  }
}

const solve1 = (startingPosition: string[][]): number => {
  const amphipods: Amphipod[] = [];
  let id = 0;

  startingPosition.forEach((row, y) => {
    row.forEach((type, x) => {
      if (type === "A") {
        amphipods.push(new Amphipod({ x, y }, "amber", 0, id));
        id += 1;
      } else if (type === "B") {
        amphipods.push(new Amphipod({ x, y }, "bronze", 0, id));
        id += 1;
      } else if (type === "C") {
        amphipods.push(new Amphipod({ x, y }, "copper", 0, id));
        id += 1;
      } else if (type === "D") {
        amphipods.push(new Amphipod({ x, y }, "desert", 0, id));
        id += 1;
      }
    });
  });

  const amphipodNavigator = new AmphipodNavigator(amphipods);

  return amphipodNavigator.getMinimumEnergyToOrganise();
};

const solve2 = (startingPosition: string[][]): number => 1;

const parse = (lines: string[]): string[][] =>
  lines.map((row) => row.split(""));

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
