import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Graph = Map<string, string[]>;

class PathNavigator {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(
    private paths: Graph,
    private currentNode: string,
    private visitedSmallCavesOnce: Set<string>,
    private visitedSmallCavesTwice: Set<string>
  ) {}

  public getTotalNumberOfPaths(): number {
    if (this.currentNode === "end") {
      return 1;
    }

    const connectedNodes = this.paths
      .get(this.currentNode)
      .filter((node) => node !== "start");
    // console.log(this.currentNode);
    const availableNodes =
      this.visitedSmallCavesTwice.size < 1
        ? connectedNodes.filter(
            (node) => !this.visitedSmallCavesTwice.has(node)
          )
        : connectedNodes.filter(
            (node) => !this.visitedSmallCavesOnce.has(node)
          );

    const nextPathNavigators = availableNodes.map((node) => {
      const nextSetOnce = new Set(this.visitedSmallCavesOnce);
      const nextSetTwice = new Set(this.visitedSmallCavesTwice);
      if (node.charAt(0).toLowerCase() === node.charAt(0)) {
        if (nextSetOnce.has(node)) {
          nextSetTwice.add(node);
        }
        nextSetOnce.add(node);
      }

      return new PathNavigator(this.paths, node, nextSetOnce, nextSetTwice);
    });

    // console.log(
    //   this.currentNode,
    //   connectedNodes,
    //   availableNodes,
    //   this.visitedSmallCavesOnce,
    //   this.visitedSmallCavesTwice
    // );

    return nextPathNavigators
      .map((pathNavigator) => pathNavigator.getTotalNumberOfPaths())
      .reduce((subtotal, n) => subtotal + n, 0);
  }
}

const solve1 = (paths: Graph): number => {
  const pathNavigator = new PathNavigator(
    paths,
    "start",
    new Set<string>(),
    new Set<string>()
  );

  return pathNavigator.getTotalNumberOfPaths();
};

const solve2 = (paths: Graph): number => 1;

const parse = (lines: string[]): Graph => {
  const paths: Graph = new Map();
  lines.forEach((line) => {
    const [node1, node2] = line.split("-");
    if (paths.get(node1)) {
      paths.set(node1, [...paths.get(node1), node2]);
    } else {
      paths.set(node1, [node2]);
    }
    if (paths.get(node2)) {
      paths.set(node2, [...paths.get(node2), node1]);
    } else {
      paths.set(node2, [node1]);
    }
  });

  return paths;
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
      simple: 10,
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
