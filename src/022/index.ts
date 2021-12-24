import assert from "assert";
import { readLines } from "../helpers/readLines";
import { Day } from "../runner";

type Cuboid = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  isOn: boolean;
};

const solve1 = (cuboids: Cuboid[]): number => {
  const onCubes = new Set<string>();

  console.log("cuboids");
  console.log(cuboids);

  // cuboids.forEach((cuboid) => {
  //   console.log(cuboid);
  //   for (let x = cuboid.minX; x <= cuboid.maxX; x += 1) {
  //     if (x < -50 || x > 50) continue;
  //     for (let y = cuboid.minY; y <= cuboid.maxY; y += 1) {
  //       if (y < -50 || y > 50) continue;
  //       for (let z = cuboid.minZ; z <= cuboid.maxZ; z += 1) {
  //         if (z < -50 || z > 50) continue;
  //         if (cuboid.isOn) {
  //           onCubes.add(`${x},${y},${z}`);
  //         } else {
  //           onCubes.delete(`${x},${y},${z}`);
  //         }
  //       }
  //     }
  //   }
  // });

  return onCubes.size;
};

const doCuboidsOverlap = (cuboidA: Cuboid, cuboidB: Cuboid): boolean => {
  if (
    (cuboidA.minX >= cuboidB.minX && cuboidA.minX <= cuboidB.maxX) ||
    (cuboidB.minX >= cuboidA.minX && cuboidB.minX <= cuboidA.maxX)
  ) {
    if (
      (cuboidA.minY >= cuboidB.minY && cuboidA.minY <= cuboidB.maxY) ||
      (cuboidB.minY >= cuboidA.minY && cuboidB.minY <= cuboidA.maxY)
    ) {
      if (
        (cuboidA.minZ >= cuboidB.minZ && cuboidA.minZ <= cuboidB.maxZ) ||
        (cuboidB.minZ >= cuboidA.minZ && cuboidB.minZ <= cuboidA.maxZ)
      ) {
        return true;
      }
    }
  }

  return false;
};

const overwriteCuboid = (cuboidA: Cuboid, cuboidB: Cuboid): Cuboid[] => {
  if (!doCuboidsOverlap(cuboidA, cuboidB)) {
    return [cuboidA];
  }

  const overlap: Cuboid = {
    isOn: !cuboidA.isOn,
    minX: Math.max(cuboidA.minX, cuboidB.minX),
    maxX: Math.min(cuboidA.maxX, cuboidB.maxX),
    minY: Math.max(cuboidA.minY, cuboidB.minY),
    maxY: Math.min(cuboidA.maxY, cuboidB.maxY),
    minZ: Math.max(cuboidA.minZ, cuboidB.minZ),
    maxZ: Math.min(cuboidA.maxZ, cuboidB.maxZ),
  };

  // console.log("overlap");
  // console.log(overlap);

  return [cuboidA, overlap];
};

const solve2 = (cuboids: Cuboid[]): number => {
  let solvedCuboids: Cuboid[] = [];

  cuboids.forEach((cuboid, i) => {
    console.log(i);
    // console.log(cuboid);
    solvedCuboids = solvedCuboids.flatMap((c) => overwriteCuboid(c, cuboid));
    if (cuboid.isOn) {
      solvedCuboids.push(cuboid);
    }
    // console.log("solved", solvedCuboids);
  });

  // console.log("solvedCuboids");
  // console.log(solvedCuboids);

  return solvedCuboids
    .map((cuboid): [boolean, number] => [
      cuboid.isOn,
      (cuboid.maxX - cuboid.minX + 1) *
        (cuboid.maxY - cuboid.minY + 1) *
        (cuboid.maxZ - cuboid.minZ + 1),
    ])
    .reduce(
      (subtotal, [isOn, volume]) =>
        isOn ? subtotal + volume : subtotal - volume,
      0
    );
};

const parse = (lines: string[]): Cuboid[] =>
  lines.map((line) => {
    const [isOn, rest] = line.split(" ");

    const match = rest.match(
      /x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
    );

    assert(match, `cannot parse ${rest}`);

    const [, minX, maxX, minY, maxY, minZ, maxZ] = match;
    const isLightOn = isOn === "on";

    return {
      minX: parseInt(minX, 10),
      maxX: parseInt(maxX, 10),
      minY: parseInt(minY, 10),
      maxY: parseInt(maxY, 10),
      minZ: parseInt(minZ, 10),
      maxZ: parseInt(maxZ, 10),
      isOn: isLightOn,
    };
  });

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
