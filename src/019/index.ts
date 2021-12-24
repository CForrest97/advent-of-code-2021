import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Position = { x: number; y: number; z: number };
type Scanner = { x: number; y: number; z: number }[];

const getAllOrientationsOfPosition = ({ x, y, z }: Position): Position[] => [
  { x: x, y: y, z: z },
  { x: -x, y: y, z: z },
  { x: x, y: -y, z: z },
  { x: x, y: y, z: -z },
  { x: -x, y: -y, z: z },
  { x: -x, y: y, z: -z },
  { x: x, y: -y, z: -z },
  { x: -x, y: -y, z: -z },
];

const compareScanners = (scanner1: Scanner, scanner2: Scanner): Set<string> => {
  const s = new Set<string>();
  const answer = new Set<string>();

  scanner1.forEach(({ x, y, z }) => {
    s.add(`${x},${y},${z}`);
  });

  let matchingBeacons = 0;

  scanner2.forEach(({ x, y, z }) => {
    const string = `${x},${y},${z}`;
    if (s.has(string)) {
      matchingBeacons += 1;
      answer.add(string);
    }
  });

  return answer;
};

const getAllPermutationsOfPosition = ({ x, y, z }: Position): Position[] =>
  [
    { x: x, y: y, z: z },
    { x: x, y: z, z: y },
    { x: y, y: x, z: z },
    { x: z, y: x, z: y },
    { x: y, y: z, z: x },
    { x: z, y: y, z: x },
  ].flatMap((position) => getAllOrientationsOfPosition(position));

const getMaxMatchingBeacons = (
  scanner1: Scanner,
  scanner2: Scanner
): [Set<string>, Position] => {
  let bestScore = new Set<string>();
  let bestRelativePosition = { x: -Infinity, y: -Infinity, z: -Infinity };

  for (let i = 0; i < scanner1.length; i += 1) {
    for (let j = 0; j < scanner2.length; j += 1) {
      const differenceX = scanner1[i].x - scanner2[j].x;
      const differenceY = scanner1[i].y - scanner2[j].y;
      const differenceZ = scanner1[i].z - scanner2[j].z;

      const matchingBeacons = compareScanners(
        scanner1,
        scanner2.map(({ x, y, z }) => ({
          x: x + differenceX,
          y: y + differenceY,
          z: z + differenceZ,
        }))
      );

      if (matchingBeacons.size > bestScore.size) {
        bestScore = matchingBeacons;
        bestRelativePosition = {
          x: differenceX,
          y: differenceY,
          z: differenceZ,
        };
      }
    }
  }

  return [bestScore, bestRelativePosition];
};

const addPositions = (pos1: Position, pos2: Position): Position => ({
  x: pos1.x + pos2.x,
  y: pos1.y + pos2.y,
  z: pos1.z + pos2.z,
});

const compare2Scanners = (
  scanner1: Scanner,
  scanner2: Scanner
): [number, Position, Scanner] => {
  const allScanner2 = scanner2.map((position) =>
    getAllPermutationsOfPosition(position)
  );

  let bestBeacons = new Set<string>();
  let bestRelativePosition = { x: -Infinity, y: -Infinity, z: -Infinity };
  let bestScanner = [];
  for (let i = 0; i < allScanner2[0].length; i += 1) {
    const s2 = allScanner2.map((p) => p[i]);

    const [beacons, relativePosition] = getMaxMatchingBeacons(scanner1, s2);
    if (beacons.size > bestBeacons.size) {
      bestBeacons = beacons;
      bestRelativePosition = relativePosition;
      bestScanner = s2;
    }
  }

  return [bestBeacons.size, bestRelativePosition, bestScanner];
};

const solve1 = (scanners: Scanner[]): number => {
  const identifiedScanners = [0];
  const relativePositions = [{ x: 0, y: 0, z: 0 }];

  const allBeacons = new Set();
  scanners[0].forEach(({ x, y, z }) => {
    allBeacons.add(`${x},${y},${z}`);
  });
  console.log(scanners.length);

  const comparedPairs = new Set<string>();

  let prev = 0;

  while (prev !== identifiedScanners.length) {
    prev = identifiedScanners.length;
    // eslint-disable-next-line guard-for-in,no-restricted-syntax,no-labels
    for (const identifiedScannerNumber of identifiedScanners) {
      console.log(identifiedScanners);
      for (let i = 0; i < scanners.length; i += 1) {
        if (i === identifiedScannerNumber) {
          continue;
        }
        if (comparedPairs.has(`${i},${identifiedScannerNumber}`)) {
          break;
        } else {
          comparedPairs.add(`${i},${identifiedScannerNumber}`);
        }
        // console.log(identifiedScannerNumber, i);
        if (!identifiedScanners.includes(i)) {
          const [score, relativePosition, orientatedScanner] = compare2Scanners(
            scanners[identifiedScannerNumber],
            scanners[i]
          );

          if (score >= 12) {
            // console.log(
            //   relativePosition,
            //   relativePositions,
            //   identifiedScannerNumber,
            //   i
            // );
            relativePositions[i] = addPositions(
              relativePosition,
              relativePositions[identifiedScannerNumber]
            );
            // console.log("orientatedScanner");
            // console.log(
            //   orientatedScanner,
            //   relativePositions[i],
            //   i,
            //   identifiedScannerNumber
            // );
            orientatedScanner
              .map((pos) => addPositions(pos, relativePositions[i]))
              .forEach((pos) => {
                allBeacons.add(`${pos.x},${pos.y},${pos.z}`);
              });
            // eslint-disable-next-line no-param-reassign
            scanners[i] = orientatedScanner;
            identifiedScanners.push(i);
            // eslint-disable-next-line no-labels
          }
        }
      }
    }
  }

  console.log(allBeacons.size, relativePositions);

  let biggestDistance = 0;
  for (let i = 0; i < relativePositions.length; i++) {
    for (let j = 0; j < relativePositions.length; j++) {
      const pos1 = relativePositions[i];
      const pos2 = relativePositions[j];
      const distance =
        Math.abs(pos2.x - pos1.x) +
        Math.abs(pos2.y - pos1.y) +
        Math.abs(pos2.z - pos1.z);

      biggestDistance = Math.max(biggestDistance, distance);
    }
  }

  return biggestDistance;
  //
  // const scanner1 = scanners[0];
  //
  // const scanner2 = scanners[1];
  //
  // console.log(compare2Scanners(scanner1, scanner2));
  //
  // const allScanner2 = scanner2.map((position) =>
  //   getAllPermutationsOfPosition(position)
  // );
  //
  // let bestBeacons = new Set<string>();
  // let bestRelativePosition = { x: -Infinity, y: -Infinity, z: -Infinity };
  // for (let i = 0; i < allScanner2[0].length; i += 1) {
  //   const s2 = allScanner2.map((p) => p[i]);
  //
  //   const [beacons, relativePosition] = getMaxMatchingBeacons(scanner1, s2);
  //   if (beacons.size > bestBeacons.size) {
  //     bestBeacons = beacons;
  //     bestRelativePosition = relativePosition;
  //   }
  // }

  // console.log(bestBeacons, bestRelativePosition);
};

const solve2 = (scanners: Scanner[]): number => 1;

const parse = (lines: string[]): Scanner[] => {
  const scanners: Scanner[] = [];
  let currentScanner: Scanner = [];

  lines.forEach((line) => {
    if (line === "") {
      scanners.push(currentScanner);
      currentScanner = [];
    } else if (line.charAt(1) !== "-") {
      const [x, y, z] = line.split(",").map((s) => parseInt(s, 10));
      currentScanner.push({ x, y, z });
    }
  });
  scanners.push(currentScanner);

  return scanners;
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
